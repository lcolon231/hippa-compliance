import type { NextConfig } from "next";

// Validate environment variables at build/boot time (throws on misconfig).
import "./src/env";

const nextConfig: NextConfig = {};

export default nextConfig;
