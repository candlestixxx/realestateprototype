# Deployment and Environment Setup Instructions

## Prerequisites
*   **Node.js**: Ensure Node.js v18 or higher is installed.
*   **npm**: The Node Package Manager is required to handle dependencies.

## Local Development Setup
1.  **Clone the Repository**: Ensure you have pulled the latest code from the `main` branch.
2.  **Install Dependencies**: Navigate to the project root and run:
    ```bash
    npm install
    ```
3.  **Start the Development Server**:
    ```bash
    npm run dev
    ```
    This will start the Vite dev server, typically accessible at `http://localhost:5173`.

## Build and Production Deployment
1.  **Type Checking and Build**: To compile the TypeScript code and build the production-ready static assets, execute:
    ```bash
    npm run build
    ```
    This command runs `tsc -b && vite build`. The output will be placed in the `dist/` directory.
2.  **Preview Build**: To preview the generated static assets locally:
    ```bash
    npm run preview
    ```
3.  **Deployment**: Deploy the contents of the `dist/` folder to any static hosting provider (e.g., Vercel, Netlify, AWS S3, or GitHub Pages).

## Linting and Code Quality
Before pushing code, ensure that all linting checks pass:
```bash
npm run lint
```
## Production Docker Deployment

The application includes a multi-stage `Dockerfile` to build and serve the complete full-stack environment from a single lightweight container.

### Building the Image
Run the following command from the root directory:
```bash
docker build -t realestate-universal-app .
```

### Running the Container
```bash
docker run -p 3001:3001 -d realestate-universal-app
```

The application will be accessible at `http://localhost:3001`. The Express API and background worker will operate over the same port, while statically serving the compiled React frontend.
