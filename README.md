# Fullstack Forums Demo a.k.a. Noided

This is the codebase for a small fullstack forums application built using the PERN stack and hosted on AWS. Users can create threads, as well as create, edit, and delete their own posts. They also have the ability to upload a profile picture as an avatar.

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

## FRONTEND

**Technologies:**
* React, Cloudflare turnstile, axios
* DEV: Vite, .env

The React frontend was build with a DRY principle in mind, starting off from small, reusable, reactive components, and building up from them. I tried to make JSX components as 'dumb' as possible, meaning they only take care of how inner parts look and how they respond to change. The specific feedback they show is given to them, and the backend communication is usually handled by context providers. Much effort was dedicated to creating instant and intuitive feedback to the user's actions, either through animation or error messages. Subtle css animations were also used in specifci places, in order to make the app look alive, but not to overwhelm the user.

**Notable parts:**

* **Button (variations):** Adjusts its appearance based on the state it keeps track of internally. Exposes a state setter through an injected ref.
* **Crop:** Custom image cropper. Uses canvases and refs to highlight a portion of the uploaded image to be send to the backend as the new avatar. 
* **UpdateAvatarProvider:** Context Provider handling requests about updating user's avatar and notifying interested components about the result through subsribed callbacks or an update key state.
* **ThreadProvider:** Context Provider handling requests to the server about CRUD operations on posts within one thread, and based on the response managing data and feedback being shown on the thread page
* **UserProvider:**  Context Provider handling storage and infromation about the currently logges user. Used to dynamically render the UI.
* **api:** Object wrapped around an axios instance, streamlining api requests, error handling and providing ui feedback messages to components.
* **AdminPanel:** Small component allowing the admin to change between currently logged users. Mainly used to populate the app, although with small enhacements could be used as a moderating tool.
* **PostFactory:** Takes a set of parameters as props, and based on them renders or doesn't render things like an EditButton, a DeleteButton, an Editable (input field), etc.

**Room for improvement:**

* Parents injecting refs to children, which then set ref.current to an internal setter proved to be error prone, generating hanginf refs. useImperativeHandle could've been used to mitigate this as well as to make the functionality more familiar and readable in a larger codebase.
* The Button component's implementation, especially with relation to css styling, could be made more organized, streamlined and maitainable. It works in the current form, but towards the end of development it became abundantly clear that current implementation doesn't provide a flexible and scalable enough solution.
* Implementation of callback subscriptions proved to be error prone, especially when said callbacks included refs to currently mounted components. I'll be experimenting with either a more general and robust interface for said functionality, or a way to handle this functionality in an alltogether different way, like updateKeys states that the interested component uses as dependencies in useEffect.
* Good deal of the app relies on assumed mounting order of the components. While it didn't produce many errors, I'm noting for fututre projects, that mounting order may not always be obvious.
* No serious performance considerations were present on the frontend, apart from using refs instead of states here and there. For starters: more liberal usage of useCallback and useMemo hooks could have been warranted. I'll be delving deeper into optimizing react apps in the near future.

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

**Database/Drizzle schemas:** Users, Posts, Threads

The backend's structure rests on main division into **Middleware**, **Controllers** and **Repositories** ( later referred to as layers ).
**Repositories** are responsible for interaction with the database through drizzle ORM. This name was chosen in order to highlight their narrow and precise scope.
**Controllers** merge the traditional responsibilites of controllers and services. This was a deliberate choice, as due to the app's small scope,
a clear distinction would result in nothing short of boilerplate. It can be argued though, that the app in its final state was nearing necesitating such a distinction.

**Notable parts:**

* **RepoBuilder:** Given a Drizzle Schema, generates a set of boilerplate CRUD functions, which can be attached to a specific Repo in bulk or selectively.
* **Errors:** A .json file with error type configuration is used by a small templating engine to create error type templates, which in turn are used to create constructors for the custom error types. index.js is then build by a script, for convenient importing of said error types.
* **Error Wrappers:** Each layer is wrapped with a designated error wrapper, which intercepts thrown errors and augments them with context data, as in which Middleware, Controller or Repo they were thrown in
* **config:** Proxy, with set method containing a param fetching function specific to the current enviroment. Using a Proxy provided not only a nice abstraction, but also effectively created a virtual object, with parameters being accesible by convenient dot syntax.
* **platform:** Folder which exports implementations of specific functions based on the current enviroment either, in development these functions rely on the .env and the file system, in production, these are adapters to S3, SSM and RDS relying on AWS SDK.
* **AvatarController.UpdateAvatar:** In production it performs cache purging of updated avatars on Cloudflare.

**Room for improvement:**

* The configuration step, which involves building error types, their index, platform providing specific functions, could've been more organized and centralized. Although it didn't generate any erros, a more refined approach would've been not only less error prone, but also far more readable.
* Though after general user authentication, resources (posts and avatars) are also verified for ownership and then validated, current implementation simply isn't done in a scalable way. First improvement is using express-validator. Second: schema for specific objects could have an "owner" field. Then general information about schemas would be accesible to middleware and controllers so that a middleware could automatically decide which resources send with PUT or DELETE requests are to be checked.
* The above opens the door for a more involved authorization system as well. Right now, only the admin has additional privileges, and the checks are implemented ad hoc. With resource ownership actually being part of the larger system, priviliges could also be defined for user roles, all of which could be checked in one Auhtorization middleware.
* The idea of writing code conditional on the enviroment was noticed rather late in the development. The platform folder is a good start, although a more flexible solution which would allow configuration for: strictly local development, local aws testing, deployment, and possibly more, would be a good idea.
* Logging is done by a custom Logger object. While informative, especially post-deployment, a more robust logging system using winston for example would be preferable.
* Testing was done "manually", with no automatic system involved. //
* Right after initial deployment, a weird bug caused Login forms in the frontend to show feedback, despite it being explicitly NOT implemented that way due to security concerns. Long story short, it was caused by error constructors storing app specific data in symbols. However, symbols aren't generated anew for every instance - one set of symbols is used throughout the app. This caused the errors to share symbols, and in turn some data being leaked into errors that absolutely shouldn't have it. A quick hack solved the problem, but needless to say, this mistake won't be made again in a future project.

---

## CI/CD

Two workflows with github actions were implemented. They take prepared IAM roles in order to streamline the whole process.
* **Backend:** Takes the repo, dockerizes it, pushes the image to ECR, then deploys it to an EC2 instance with SSM and runs it.
* **Frontend:** Takes the repo, builds it, pushes to S3 bucket.

## AWS/Hosting

* **ECR:** Used solely to store an image of the Node-Express backend.
* **EC2:** Holds the container running the backend. Has a Cloudflare origin certificate installed, which is mounted onto the image. Has an IAM role which provides minimal permissions for interactions with SSM and S3. Security group provides minimal neccesary rules for inbound https trafiic and communication with RDS.
* **RDS:** Runs a postgres database. Due to small scale of the app, schemas and data could be pushes by a locally executed script using Drizzle ORM and Kit.
* **S3:**  Used to serve the React frotnend statically, as well as storing and serving avatars.
* **SSM:** Specifically Parameter Store is used for storing and retrieving configuration, as well as confidential data: keys, connection string, data limits, certificates, etc.

* **Cloudflare:** Root of a Cloudflare domain is pointing to the S3 endpoint, while a api-designated subdomain is pointing to EC2 instance's endpoint.
  
---

## SECURITY

* **CORS** on the backend only allows request from the frontend url
* **Data limit** of 1MB imposed on received data
* **Rate limiter** 
* **Authentication** using JWT
* **JWT** are stored as http only cookies, payload only contains user-specific, non-vurneable data
* **Cloudflare turnstile**
* **Cloudflare domain** is utilized, leveraging its built-in security features, including a reverse proxy
* **Cloudflare origin certificate** is installed on EC2 instance

* **AWS data** in workflows is stored as Github Actions secrets
* **Configuration parameters** and vurneable data are stored in SSM parameter store
* **IAM roles** are heavily prefered over using access/ssh keys

---

*Formatting kindly provided by **Google Gemini***

