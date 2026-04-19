# CampusBridge

CampusBridge is a full-stack platform consisting of a backend REST API and a cross-platform mobile frontend application.

## Repository Structure

- **`/backend`** - The Express Node.js API (powered by Prisma ORM and TypeScript).
- **`/frontend`** - The Expo React Native mobile application.

## Getting Started

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Copy `.envdummy` to `.env` and configure your database variables (PostgreSQL / MySQL).
3. Install the dependencies (Bun or NPM):
   ```bash
   bun install
   ```
4. Run the Prisma setup to generate the client and push the schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Start the backend development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the Expo development server:
   ```bash
   npx expo start
   ```

## License

This project is open-source and available under the standard MIT License.
