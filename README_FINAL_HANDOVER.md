# Final Handover Instructions

The autonomous universal business content calendar has been verified and is ready for production staging.

## To Deploy:
1. Provision the following environment variables on your host machine or Docker environment:
   - `OPENAI_API_KEY`
   - `JWT_SECRET`
   - `TWITTER_API_KEY` (and corresponding OAuth tokens)
2. Build the Docker container: `docker build -t universal-content-calendar:latest .`
3. Run the container, mapping port 3001: `docker run -p 3001:3001 -d universal-content-calendar:latest`

The next logical step is for the operations team to execute this deployment and begin User Acceptance Testing (UAT).
