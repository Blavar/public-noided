# Fullstack Forums App (PERN Stack on AWS)

This is the codebase for a small fullstack forums application built using the PERN stack (PostgreSQL, Express.js, React, Node.js) and hosted on Amazon Web Services (AWS). Users can create threads, as well as create, edit, and delete their own posts. They also have the ability to upload a profile picture as an avatar.

**Note:** This is a public version of the code, and some sensitive data has been altered or redacted for security purposes.

## Technologies Used:

* **Backend:** Node.js, Express.js
* **Frontend:** React, Vite
* **Database:** PostgreSQL, Drizzle ORM
* **Authentication:** JWT
* **Security:** Cloudflare
* **DevOps:** GitHub Actions, Docker
* **Cloud Hosting:** AWS (EC2, ECR, RDS, S3, SSM, IAM)

---

## Frontend

**Technologies:**

* React
* Cloudflare Turnstile
* Axios
* **Dev:** Vite, .env

The React frontend was built with a **DRY (Don't Repeat Yourself)** principle in mind, starting with small, reusable, and reactive components. The aim was to create "dumb" JSX components that primarily focus on visual presentation and responding to prop changes. Component-specific feedback is provided externally, and backend communication is generally managed by Context Providers.

Significant effort was invested in providing instant and intuitive feedback to user actions through animations and clear error messages. Subtle CSS animations are used in specific areas to enhance the user experience without being overwhelming.

**Notable Parts:**

* **Button (variations):** This component dynamically adjusts its appearance based on its internal state and exposes a state setter via an injected ref.
* **Crop:** A custom image cropper utilizing HTML5 Canvas and refs to allow users to select a portion of an uploaded image to be sent to the backend as their new avatar.
* **UpdateAvatarProvider:** A Context Provider responsible for handling requests to update a user's avatar and notifying interested components about the outcome through subscribed callbacks or an update key state.
* **ThreadProvider:** A Context Provider managing requests to the server for CRUD operations on posts within a specific thread. It also handles updating the displayed data and providing feedback on these operations.
* **UserProvider:** A Context Provider that stores and provides information about the currently logged-in user, enabling dynamic rendering of the UI based on authentication status.
* **api:** An object wrapping an Axios instance to streamline API requests, handle errors consistently, and provide UI feedback messages to components.
* **AdminPanel:** A small component (intended for development/population purposes) allowing an administrator to switch between logged-in users. With minor enhancements, it could serve as a basic moderation tool.
* **PostFactory:** A component that dynamically renders specific UI elements within a post (e.g., EditButton, DeleteButton, Editable input field) based on a set of parameters passed as props.

**Room for Improvement:**

* The pattern of parent components injecting refs into children for setting internal setters proved to be error-prone, leading to potential hanging refs. Utilizing `useImperativeHandle` could have mitigated this and improved code readability in larger codebases.
* The implementation of the `Button` component, particularly its CSS styling, could be made more organized, streamlined, and maintainable for better flexibility and scalability.
* Implementing callback subscriptions for state updates based on server responses caused issues, especially when these callbacks relied on refs to currently mounted components. Exploring a more robust interface or alternative approaches like using `updateKey` states with `useEffect` dependencies would be beneficial.
* The application's logic in several places relies on the assumed mounting order of components. While this didn't cause significant errors in this project, it's a potential pitfall to avoid in future projects where mounting order might be less predictable.
* Performance optimization on the frontend was not a primary focus during development. Implementing techniques like more liberal use of `useCallback` and `useMemo` hooks could likely improve performance. Further exploration of React optimization strategies is planned.

---

## Backend

**Technologies:**

* Node.js, Express.js
* Drizzle ORM - Database Interaction
* Drizzle Kit - Database Migrations
* JWT - Authentication
* aws-sdk v3 - Integration with AWS Services
* Axios
* CORS
* **Dev:** Nodemon, .env

**Database/Drizzle Schemas:** Users, Posts, Threads

The backend's structure is primarily divided into **Middleware**, **Controllers**, and **Repositories** (later referred to as layers).

* **Repositories:** Responsible for direct interaction with the PostgreSQL database using Drizzle ORM. This layer's name emphasizes its focused scope.
* **Controllers:** Merge the traditional responsibilities of both controllers and services. This decision was made due to the application's small scale, where a strict separation might have resulted in excessive boilerplate. However, the application's final state was approaching a point where a dedicated Service layer might be beneficial.

**Notable Parts:**

* **RepoBuilder:** A utility that, given a Drizzle Schema, generates a set of standard CRUD (Create, Read, Update, Delete) functions. These functions can be attached to specific Repositories in bulk or selectively, reducing boilerplate code.
* **Errors:** A system that reads a `.json` file containing error type configurations. A small templating engine processes this configuration to create error type templates, which are then used to generate constructors for custom error types. An `index.js` file is built by a script to facilitate convenient importing of these error types.
* **Error Wrappers:** Each layer (Middleware, Controller, Repository) is wrapped with a designated error wrapper. This wrapper intercepts any errors thrown within the layer and augments them with contextual information, indicating the specific layer and method where the error originated, aiding in debugging.
* **config:** An object implemented as a Proxy. Its `set` method contains a parameter fetching function tailored to the current environment. Using a Proxy provides a clean abstraction and allows accessing configuration parameters using a convenient dot syntax, effectively creating a virtual configuration object.
* **platform:** A folder containing environment-specific function implementations. In development, these functions rely on `.env` files and the local file system. In production, they are adapters for interacting with AWS services (S3, SSM, RDS) using the AWS SDK.
* **AvatarController.UpdateAvatar:** In the production environment, this controller method also performs cache purging of updated avatar images on Cloudflare to ensure users see the latest version quickly.

**Room for Improvement:**

* The configuration process for building error types, the error index, and the platform-specific functions could be more organized and centralized for improved readability and reduced potential for errors.
* Though after general user authentication, resources (posts and avatars) are also verified for ownership and then validated, the current implementation lacks scalability. Future improvements include leveraging `express-validator`. Second: schema for specific objects could have an "owner" field. Then general information about schemas would be accessible to middleware and controllers so that a middleware could automatically decide which resources sent with PUT or DELETE requests are to be checked.
* The above opens the door for a more involved authorization system as well. Right now, only the admin has additional privileges, and the checks are implemented ad hoc. With resource ownership actually being part of the larger system, privileges could also be defined for user roles, all of which could be checked in one Authorization middleware.
* The idea of writing code conditional on the environment was noticed rather late in the development. The `platform` folder is a good start, although a more flexible solution that would allow configuration for strictly local development, local AWS testing, deployment, and possibly more, would be a good idea.
* Logging is currently handled by a custom `Logger` object. While it provides basic information, migrating to a more robust logging library like Winston would offer features such as different log levels, transports, and formatting options.
* Testing was primarily done manually. Implementing an automated testing framework is crucial for ensuring code reliability and facilitating easier refactoring and feature additions.
* Right after initial deployment, a weird bug caused Login forms in the frontend to show feedback, despite it being explicitly NOT implemented that way due to security concerns. Long story short, it was caused by error constructors storing app-specific data in symbols. However, symbols aren't generated anew for every instance - one set of symbols is used throughout the app. This caused the errors to share symbols, and in turn some data being leaked into errors that absolutely shouldn't have it. A quick hack solved the problem, but needless to say, this mistake won't be made again in a future project.

---

## CI/CD

Two workflows using GitHub Actions were implemented, leveraging prepared IAM roles to streamline the entire process.

* **Backend:** Takes the repository, dockerizes the application, pushes the Docker image to ECR, and then deploys and runs it on an EC2 instance using SSM.
* **Frontend:** Takes the repository, builds the application, and pushes the static files to an S3 bucket.

---

## AWS Infrastructure

* **ECR (Elastic Container Registry):** Used solely for storing the Docker image of the Node.js/Express.js backend.
* **EC2 (Elastic Compute Cloud):** Hosts the Docker container running the backend application. It has a Cloudflare origin certificate installed and mounted onto the container. An IAM role with minimal necessary permissions is attached, allowing interaction with SSM and S3. The security group is configured with the minimal inbound HTTPS traffic rules and allows communication with the RDS instance.
* **RDS (Relational Database Service):** Runs a PostgreSQL database. Due to the application's small scale, database schema and initial data could be applied using locally executed Drizzle ORM and Kit scripts.
* **S3 (Simple Storage Service):** Used to serve the static files of the React frontend and to store and serve user avatars.
* **SSM (Systems Manager):** Specifically, Parameter Store is used for securely storing and retrieving configuration parameters and sensitive data, such as API keys, database connection strings, data limits, and the Cloudflare certificate.

---

## Security

* **CORS (Cross-Origin Resource Sharing):** Configured on the backend to only allow requests from the frontend's specific URL.
* **Data Limit:** A 1MB limit is imposed on the size of incoming request data to prevent potential abuse.
* **Rate Limiter:** Implemented to protect against brute-force attacks and excessive requests.
* **Authentication:** User authentication is handled using JWT (JSON Web Tokens).
* **JWT Storage:** JWTs are stored as HTTP-only cookies, and the payload only contains user-specific, non-vulnerable data.
* **Cloudflare Turnstile:** Implemented on frontend forms to protect against bot submissions.
* **Cloudflare Domain:** The application utilizes a Cloudflare domain, which provides its own security measures, including a reverse proxy, to protect against various web threats.
* **Cloudflare Origin Certificate:** An origin certificate from Cloudflare is installed on the EC2 instance to ensure secure HTTPS communication between Cloudflare and the backend server.
* **AWS Secrets Management:** Sensitive AWS credentials used in CI/CD workflows are securely stored as GitHub Actions secrets.
* **Configuration Security:** Configuration parameters and vulnerable data are stored securely in AWS SSM Parameter Store.
* **IAM Roles:** IAM roles are heavily preferred over using static access keys or SSH keys for interacting with AWS services.


