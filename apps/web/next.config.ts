import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    // Sem isso o Next sobe a árvore procurando lockfile e escolhe a home do
    // usuário como raiz (existe um package-lock.json solto lá). Fixa na raiz
    // real do monorepo.
    root: path.join(import.meta.dirname, '../..'),
  },
};

export default nextConfig;
