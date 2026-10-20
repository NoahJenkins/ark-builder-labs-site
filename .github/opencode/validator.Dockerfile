FROM node:22-bookworm-slim@sha256:efd0ab5780c2d9ab1f0f869571a00d5edb17793bff4cce4a2792e3eb0ffc7562
RUN npm install --global --ignore-scripts pnpm@10.33.0
ENV CI=true NEXT_TELEMETRY_DISABLED=1
WORKDIR /workspace
USER node
