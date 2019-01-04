# Winkit CLI

Using this CLI you can start a new Winkit Project from scratch and manage its content.

A Winkit project is a base platform generated with [Angular CLI](https://github.com/angular/angular-cli) that has the goal of generating a platform to menage CRUD of dynamic content.

## Minimum requirements
- [Yarn 1.10.1](https://yarnpkg.com/en/docs/install)
- [Node 8.12.0 + npm](https://nodejs.org/)

## Get started
- Go in winkit-cli folder and run `yarn install`
- Run `yarn link && yarn link "winkit"` in the folder where you will generate the project
- Open the terminal and type `winkit --help`

## Init new Winkit Based project
- [Configure your server](#conf-server)
- Create a new folder and go inside
- Run `winkit init`
- Choose the server you want to work with (**Firestore** or **Strapi / Http**)
- Enjoy!

<a name="conf-server"></a>
## Server configuration

### a. Firestore

If you want to use Winkit with Firestore you must first configure your project in [Firebase](https://console.firebase.google.com/u/0/).
<br>Once the project is created, open `/src/environments/environment.ts` and update `firebaseConfig` with the project info.
<br>Do the same for `/src/environments/environment.prod.ts` with info for production environment.

### b. Strapi
1. install strapi globally
```
npm install strapi@alpha -g
```

2. Run the following command line in your terminal:
```
strapi new strapi-winkit
```

3. Go to your project and launch the server:
```
cd strapi-winkit
strapi start
```

4. Create your first admin user

5. Open `strapi-winkit/plugins/users-permissions/models/User.settings.json`

6. Replace the content with the following:

```
{
  "connection": "default",
  "info": {
    "name": "user",
    "description": ""
  },
  "attributes": {
    "username": {
      "type": "string",
      "minLength": 3,
      "unique": true,
      "configurable": false,
      "required": true
    },
    "email": {
      "type": "email",
      "minLength": 6,
      "configurable": false,
      "required": true
    },
    "password": {
      "type": "password",
      "minLength": 6,
      "configurable": false,
      "private": true
    },
    "confirmed": {
      "type": "boolean",
      "default": false,
      "configurable": false
    },
    "blocked": {
      "type": "boolean",
      "default": false,
      "configurable": false
    },
    "role": {
      "model": "role",
      "via": "users",
      "plugin": "users-permissions",
      "configurable": false
    },
    "userRole": {
      "default": "",
      "type": "string"
    },
    "firstName": {
      "default": "",
      "type": "string"
    },
    "lastName": {
      "default": "",
      "type": "string"
    },
    "description": {
      "default": "",
      "type": "string"
    },
    "telephone": {
      "default": "",
      "type": "string"
    },
    "profileImg": {
      "default": "",
      "type": "string"
    },
    "dateOfBirth": {
      "default": "",
      "type": "integer"
    },
    "registeredAt": {
      "default": "",
      "type": "integer"
    },
    "isMale": {
      "default": false,
      "type": "boolean"
    },
    "media": {
      "collection": "file",
      "via": "related",
      "plugin": "upload"
    }
  },
  "collectionName": "users-permissions_user"
}

```

7. Go to `http://localhost:1337/admin/plugins/content-manager/user?source=users-permissions`

8. Open the admin detail and populate the userRole field with the value `ADMIN` then save.

9. Now you can log into Winkit using these user credentials!

# Commands

### winkit init

The Winkit CLI makes it easy to create an application that already works, right out of the box.
<br>Included are: authentication, password recovery, user CRUD, profile page, file upload, etc. And everything will work after this command!

### winkit create:model|cm \<name\>

Generate a new model and its associated server model, ready to be mapped.
<br>Let's explain with an example:
```
winkit create:model Foo
```
This command will generate two files:
##### 1. src/app/models/Foo.ts
_map(obj: ServerFoo): Foo_ : maps the model starting from its server model.
```
Ex. const foo = new Foo().map(serverFoo);
```

_mapReverse(): ServerFoo_ : maps the model starting from its server model.
```
Ex. const serverFoo = foo.mapReverse();
```

##### 2. src/app/server/models/ServerFoo.ts
_static map(obj: Foo): ServerFoo_ : this method is called by the model _mapReverse_ function.

Edit this method to manage the mapping as you need.
```
Ex.
const o = {} as ServerFoo;
o.first_name = obj.firstName || null;
```

_static mapReverse(serverObject: ServerUser): User_ : this method is called by the  model _map_ function.

Edit this method to manage the mapping as you need.
```
Ex.
const o = {} as Foo;
o.firstName = serverObject.first_name || null;
```

### winkit create:service|cs \<modelName\>

Generate a new service for given model, so you'll be ready to implement CRUD that works with the server chosen in the initialization.
<br>Let's explain with an example:
```
winkit create:service Foo
```

This command will generate the service and add it to the services.module.ts:
##### src/app/services/foo.service.ts
on creation the service includes methods that allow you to:
- Create model
- Update model
- Delete model
- Get model by id
- Get paginated list

### winkit create:detail|cd \<modelName\>
Generate a new detail component for given model and implement its routing, so you'll be ready to display model info.
<br>Let's explain with an example:
```
winkit create:detail Foo
```

This command will generate:
##### 1. src/app/pages/platform/foo-detail/
- foo-detail.component.ts
- foo-detail.component.html
- foo-detail.component.scss

This component implements the CRUD of the Model, including validation.

##### 2. `foo/:id` route in src/app/app.routing.ts
By default the generated route is accessible just by authenticated user with ADMIN role.
<br>Thanks to this route you can:
-  Create new instance of this model:
```
 localhost:5000/foo/new
```
-  Detail / Update the instance with given id, ex. #1:
```
 localhost:5000/foo/1
```

NOTE: if you are using Strapi remember to also create the model on the server-side (ex. using the Strapi dashboard).
<br>If you are using Firestore you don't have to do anything because everything will be managed by Winkit.

### winkit create:list|cl \<modelName\>
Generates a new list component for given model, implements its routing and adds the link to the navbar, so the list is ready to be displayed, including pagination and filtering.

Let's explain with an example:
```
winkit create:list Foo
```
This command will generate:
##### 1. src/app/pages/platform/foo-list/
- foo-list.component.ts
- foo-list.component.html
- foo-list.component.scss

This component includes the paginated table list and the filter component.

##### 2. `foo-list` route in src/app/app.routing.ts
By default the generated route is accessible just by authenticated user with ADMIN role.
<br>Every element in the table includes a link to its detail page.
##### 3. `foo-list` link in src/app/components/sidebar/sidebar-routes.config.ts
By default the link is visible just to ADMIN users.

# Known issues
- Strapi has been reported to not support Node.js >9 versions on certain versions of Windows. [Link to issue](https://github.com/strapi/strapi/issues/1602)
- In Firestore the filter feature is case sensitive and must match the whole value

# Contact

If you find any errors, typos, issues... basically anything that you think we should fix or improve in Winkit, send us an email to info@wink.by

# What's next?
### winkit update:model|um \<modelName\>
This command will:
- Automatically find new parameters added to the model and update constructors and mapping methods
- Generate html elements for new parameters in the detail component
- Set the html element's required/readonly/disabled attributes
- Validate all generated html elements in the ViewModel of the detail component
- Add the generated parameter to the table header in the list component
