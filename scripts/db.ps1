<#
.SYNOPSIS
  Gerencia o Postgres de desenvolvimento.

.DESCRIPTION
  Nesta máquina o Docker roda dentro do Ubuntu (WSL2), sem Docker Desktop, e o
  app roda no Windows. Funciona porque o WSL2 encaminha localhost.

  Existe uma armadilha que este script resolve: o WSL encerra a distro quando
  nenhum processo do lado Windows está preso a ela. Quando isso acontece, o
  Docker para e o container do Postgres cai. O sintoma é enganoso — o banco
  parece "sumir" e o Prisma falha com P1001, mas nada crashou.

  A solução é manter um processo wsl.exe vivo no Windows (o keepalive abaixo).
  Enquanto ele existir, a distro fica de pé.

  Em máquinas com Docker Desktop ou Docker nativo, nada disso é necessário:
  basta `docker compose up -d` na raiz do repo.

.PARAMETER Action
  up      sobe o banco e o keepalive, espera ficar healthy (padrão)
  down    para o container (mantém os dados)
  reset   APAGA os dados e recria o banco vazio
  status  mostra o estado de tudo
  logs    acompanha o log do Postgres
  psql    abre um psql interativo
#>
param(
  [ValidateSet('up', 'down', 'reset', 'status', 'logs', 'psql')]
  [string]$Action = 'up'
)

$ErrorActionPreference = 'Stop'

$Distro = 'Ubuntu'
$Container = 'titan-postgres'
# Caminho do repo visto de dentro do WSL.
$RepoWsl = '/mnt/c/Users/User/projects/titan-site'

function Invoke-Wsl {
  param([string]$Command)
  wsl -d $Distro -- sh -c $Command
}

function Test-Keepalive {
  # Um wsl.exe com 'sleep infinity' é o que segura a distro viva.
  $procs = Get-CimInstance Win32_Process -Filter "Name='wsl.exe'" -ErrorAction SilentlyContinue
  foreach ($p in $procs) {
    if ($p.CommandLine -and $p.CommandLine -match 'sleep\s+infinity') { return $true }
  }
  return $false
}

function Start-Keepalive {
  if (Test-Keepalive) {
    Write-Host 'keepalive do WSL: ja rodando' -ForegroundColor DarkGray
    return
  }
  Start-Process -FilePath 'wsl.exe' `
    -ArgumentList '-d', $Distro, '--', 'sleep', 'infinity' `
    -WindowStyle Hidden
  Start-Sleep -Seconds 2
  if (Test-Keepalive) {
    Write-Host 'keepalive do WSL: iniciado' -ForegroundColor Green
  } else {
    Write-Warning 'keepalive nao subiu — o banco pode cair quando o WSL ficar ocioso'
  }
}

function Wait-Healthy {
  param([int]$TimeoutSeconds = 90)
  $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
  while ((Get-Date) -lt $deadline) {
    $health = (Invoke-Wsl "docker inspect $Container --format '{{.State.Health.Status}}' 2>/dev/null").Trim()
    if ($health -eq 'healthy') { return $true }
    if ($health -eq 'unhealthy') {
      Write-Warning "container unhealthy — veja: pnpm db:logs"
      return $false
    }
    Start-Sleep -Seconds 2
  }
  Write-Warning "timeout esperando o banco ficar healthy"
  return $false
}

switch ($Action) {
  'up' {
    Start-Keepalive
    Invoke-Wsl "cd $RepoWsl && docker compose up -d" | Out-Null
    if (Wait-Healthy) {
      Write-Host 'Postgres pronto em localhost:5432' -ForegroundColor Green
    } else {
      exit 1
    }
  }

  'down' {
    Invoke-Wsl "cd $RepoWsl && docker compose down"
    Write-Host 'Postgres parado. Os dados continuam no volume titan-pgdata.' -ForegroundColor Yellow
  }

  'reset' {
    Write-Host 'Isto APAGA todos os dados locais do banco.' -ForegroundColor Red
    $answer = Read-Host 'Digite "apagar" para confirmar'
    if ($answer -ne 'apagar') {
      Write-Host 'Cancelado.' -ForegroundColor Yellow
      exit 0
    }
    Invoke-Wsl "cd $RepoWsl && docker compose down -v"
    Start-Keepalive
    Invoke-Wsl "cd $RepoWsl && docker compose up -d" | Out-Null
    if (Wait-Healthy) {
      Write-Host 'Banco recriado vazio. Rode: pnpm --filter api prisma migrate dev' -ForegroundColor Green
    }
  }

  'status' {
    Write-Host "keepalive do WSL: $(if (Test-Keepalive) { 'rodando' } else { 'AUSENTE — o banco vai cair quando o WSL ficar ocioso' })"
    Invoke-Wsl "docker ps -a --filter name=$Container --format 'container: {{.Names}} — {{.Status}}'"
    $reachable = Test-NetConnection -ComputerName 127.0.0.1 -Port 5432 -InformationLevel Quiet -WarningAction SilentlyContinue
    Write-Host "localhost:5432 do Windows: $(if ($reachable) { 'acessivel' } else { 'INACESSIVEL' })"
  }

  'logs' { Invoke-Wsl "docker logs -f --tail 50 $Container" }

  'psql' { wsl -d $Distro -- docker exec -it $Container psql -U titan -d titan }
}
