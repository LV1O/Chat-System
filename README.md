# Log In Details

To test the permissions for each user, please use the following usernames and passwords for login:

- SuperAdmin  `{ email: 'Lora', password: '1' }` 
- GroupAdmin1  `{ email: 'Melissa', password: '2' }`
- User  `{ email: 'James', password: '3' }`
- SuperUser `{ email: 'Super', password: '123' }`

# Documentation

## Git Organisation

The frequency of git commits were not up to the standard I had hoped, I aimed to push commits after minor edits and tweaks, but instead, commits were only made after significant breakthroughs. I often got caught up in my work and forgot to commit frequently, resulting in lengthy commit messages, some commits even requiring extra comments.

## Description of Data Structures (Client and Server Side)

In terms of data structures used to represent my entities , I've used simple JSON data structures. On the client side, I use a data.json file to define users and groups. In this file, the users array contains properties such as email, password, id, and role, which help manage user logins and roles and view permissions.

## Angular Architecture: Components, Services, Models, Routes

The architecture of my Angular application is organized into several components, including LogInPageComponent, GroupsPageComponent, Group1PageComponent, Group2PageComponent, and Group3PageComponent. Each component comes with its own HTML and CSS files, which manage the styling and layout of the page. Accompanying each component is a corresponding .component.ts file that defines the logic and functionality specific to that component. The DataService.ts file handles the fetching and management of data from APIs or files. Additionally, the app-routing.module.ts file configures the navigation paths and specifies which components are rendered for each route.

## Node Server Architecture: Modules, Functions, Files, Global Variables

The Node server configuration was generated during the app setup, it uses Express to manage routes and serve static files. Cors is also included to manage cross origin requests.

## Interaction Between Client and Server

When a user logs in, the angular component sends a request to the server to validate the log in details. The server checks the data and responds with navigation to the groups page or an error message Based on the login outcome the client updates the UI accordingly. SuperAdmins have access to additional features compared to group admins and regular users. For instance, if a SuperAdmin is logged in, each group will display a join button. If a regular user is logged in, they will see a request access button under Group 3. Furthermore, upon joining the group SuperAdmins and GroupAdmins have access to a wider range of features than the regular user who at this point in development can only see the back button.
