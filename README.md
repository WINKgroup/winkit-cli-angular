# Winkit Angular

IMPORTANT: Before starting a Winkit Angular project, make sure to read about the [basics of Winkit CLI](https://github.com/WINKgroup/winkit-cli).

# Contents

1. [Adding Winkit Angular plugin](#adding-winkit-angular-plugin)
2. [Getting help](#getting-help)
3. [Quick start](#quick-start)
4. [Server configuration](#conf-server)
5. [Primary database key](#primary-key)
6. [Winkit Angular commands](#commands)
    1. [Initializing a project](#init-project)
    2. [Generating a model](#generate-model)
    3. [Generating a service](#generate-service)
    4. [Generating a detail](#generate-detail)
    5. [Generating a list](#generate-list)
    6. [Updating a model](#update-model)
7. [Known issues](#known-issues)
8. [What's next?](#whats-next)

## Adding Winkit Angular plugin

To add the Winkit Angular plugin to your project, run:
```
winkit add:plugin angular
```
## Getting help
To get help on Winkit Angular commands run `winkit angular --help`

## Quick start
- [Configure your server](#conf-server)
- Run `winkit angular init <projectName>`
- Choose the server you want to work with ([Firestore](#conf-server-firestore) or [Strapi / Http](#conf-server-strapi))
- Provide the [primary key](#primary-key) you want to use in the project (or skip this step to use the default key)
- Enjoy!

<a name="conf-server"></a>
## Server configuration

Out-of-the-box **Winkit Angular** supports two server platforms - Strapi ([visit website](https://strapi.io/)) and Firestore ([visit website](https://firebase.google.com/docs/firestore/)). Learn how to prepare your server for work with Winkit Angular:
* [Firestore](#conf-server-firestore)
* [Strapi](#conf-server-strapi)

<a name="conf-server-firestore"></a>
### Firestore

If you want to use Winkit with Firestore you must first configure your project in [Firebase](https://console.firebase.google.com/u/0/).
<br>Once the project is created, open `/src/environments/environment.ts` and update `firebaseConfig` with the project info.
<br>Do the same for `/src/environments/environment.prod.ts` with info for production environment.

<a name="conf-server-strapi"></a>
### Strapi
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

<a name="primary-key"></a>
## Primary database key

In your Winkit project you can either use the default primary database key or configure a custom primary database key.

The default key is 'id' (for the front-end) and '_id' (for the back-end). To use a different key provide it when prompted for the primary key upon [initializing your project](#init-project).

After initializing the project you can still change the primary key at any point in time by following these steps:
1. In the _\<project folder\>/winkit.conf.json_ file add or edit the `primaryKey` key by providing your value (minimum 2 characters).
2. Edit the _\<project folder\>/src/app/@core/models/Mappable.ts_ file by providing the name of your primaryKey as the first key of the Mappable interface;
3. Update all models in your project using the `winkit angular update model ...` command ([more info](#update-model));

## Commands

<a id="init-project"></a>
### winkit angular init|i \<projectName\>

Initializes a new WDK Angular application in a new folder.
```
winkit angular init myproject
```
The application works right out of the box. Included are: authentication, password recovery, user CRUD, profile page, file upload, etc.

<a id="generate-model"></a>
### winkit angular generate|g model \<name\>

Generate a new model and its associated server model, ready to be mapped.

NOTE: If you are using **Strapi** remember to also:
* create the model on the server-side (ex. using the Strapi dashboard)
* add the `wid: string` parameter for both models

(if you are using **Firestore** you don't have to do anything because everything will be managed by WDK Angular)

Let's explain with an example:
```
winkit angular generate model Foo
```
This command will generate the following file structure in the _src/app/modules/_ folder:

* `foo/`
    * `models/`
        * `Foo.ts`
        * `ServerFoo.ts`
        * `FooDataFactory.ts`
    * `foo.conf.json`
    * `foo.module.ts`
    * `foo.routing.ts`

NOTE: The _foo/_ directory and the _foo.conf.json_, _foo.module.ts_ and _foo.routing.ts_ files are only generated if they don't exist yet.

##### 1. src/app/modules/foo/models/Foo.ts
* _map(obj: ServerFoo): Foo_ : maps the model starting from its server model.
    ```
    Ex. const foo = new Foo().map(serverFoo);
    ```

* _mapReverse(): ServerFoo_ : maps the model starting from its server model.
    ```
    Ex. const serverFoo = foo.mapReverse();
    ```

<a id="generate-model-server"></a>
##### 2. src/app/modules/foo/models/ServerFoo.ts
* _static map(obj: Foo): ServerFoo_ : this method is called by the model _mapReverse_ function.

    If you want to initialize an attribute directly inside this method, make sure to set it's `skipUpdate` attribute in the _\<model\>.conf.json_ file to `true`.
    
    [Learn more about model configuration](#model-property-structure)
    
    Then provide the initialization logic, e.g.:
    ```
    Ex.
    const o = {} as ServerFoo;
    o.your_attribute = obj.your_attribute || null;
    ```

* _static mapReverse(serverObject: ServerUser): User_ : this method is called by the  model _map_ function. Same provisions apply as for the _map_ method (see above).

* _private static getMappedAttribute(model: User, prop: ModelProperty): string_ : this method is used in the server model _map_ function to compute the value of the server model attribute.
    
    The default logic is:
    ```angularjs
    typeof model[localName] !== 'undefined' ? model[localName] : defaultValue
    ```
    To provide your own logic, use the `"map"` attribute of the [ModelProperty object](#update-model) in _\<model\>.conf.json_

* _private static getReverseMappedAttribute(serverObject: ServerUser, prop: ModelProperty): string_ : this method is called by the server model _mapReverse_ function to compute the value of the model attribute.

    The default logic is:
    ```angularjs
    typeof serverObject[serverName] !== 'undefined' ? serverObject[serverName] : defaultValue
    ```
    To provide your own logic, use the `"mapReverse"` attribute of the [ModelProperty object](#update-model) in _\<model\>.conf.json_

##### 3. src/app/modules/foo/models/FooDataFactory.ts
File providing data used by the model's components. This file is updated by Winkit Angular based on the `htmlConfig` configuration in model properties.
* [updating Winkit models](#update-model)
* [htmlConfig object structure](#html-config-structure)

##### 4. src/app/modules/foo/foo.conf.json
The model configuration file. For more information on using the file, see the [update model](#update-model) documentation.

##### 5. src/app/modules/foo/foo.module.ts
The model module file - a standard Angular module which handles all the data and dependencies related to the model.

##### 6. src/app/modules/foo/foo.routing.ts
The model routing file. It exports an object with 2 properties: 
* `componentRoutes` _(required)_:  an array of Angular type [Routes](https://angular.io/api/router/Routes)
* `routeInfo` _(optional)_:  an object of type [RouteInfo](https://github.com/WINKgroup/winkit-cli-angular/blob/master/resources/templates/project_template/src/app/%40core/sidebar/sidebar.metadata.ts)

<a id="generate-service"></a>
### winkit angular generate|g service \<modelName\>

Generate a new service for given model, so you'll be ready to implement CRUD that works with the server chosen in the initialization.

NOTE: If the associated model does not exist yet, it is generated together with all necessary files (for more info see [generate model](#generate-model) section), before the the service file is generated.

Let's explain with an example:
```
winkit angular generate|g service Foo
```

This command will generate the service and add it to the foo.module.ts:
##### src/app/modules/foo/service/foo.service.ts
on creation the service includes methods that allow you to:
- Create model
- Update model
- Delete model
- Get model by id
- Get paginated list

<a id="generate-detail"></a>
### winkit angular generate|g detail \<modelName\>
Generate a new detail component for given model and implement its routing, so you'll be ready to display model info.

Let's explain with an example:
```
winkit angular generate|g detail Foo
```

This command will generate:
##### 1. src/app/modules/foo/foo-detail/
- foo-detail.component.ts
- foo-detail.component.html
- foo-detail.component.scss

This component implements the CRUD of the Model, including validation.

##### 2. `foo/:id` route in src/app/modules/foo/foo.routing.ts
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
---
<a id="detail-form"></a>
NOTE: The model info will be displayed in the detail component inside a `<form>` element. You can manage the form control elements inside the form by:
* editing the `<modelName>-detail.component.html` file (make sure to add `"skipUpdate": true` to the property's config in _\<model\>.conf.json_)
* editing the `<modelName>.conf.json` configuration file and updating the model and detail ([more info](#update-model))
* passing an array of type [FormControlList](https://github.com/WINKgroup/winkit-cli-angular/blob/master/resources/templates/project_template/src/app/%40core/models/FormControlTypes.ts) as the 2nd argument in the `<modelName>DataFactory.getFormControls()` call in `<modelName>-detail.component.ts` (make sure to add `"skipUpdate": true` to the property's config in _\<model\>.conf.json_). For example:

.../_someModel-detail.component.ts_
```angularjs
this.formControlList = ZdueDataFactory.getFormControls(this, [
  {name: 'sometext', type: FormControlType.TEXT}
]);
```
.../_someModel.conf.json_
```json5
"properties": [
    {"name": "someText", "skipUpdate": true},
    ...
]
```
<a id="generate-list"></a>
### winkit angular generate|g list \<modelName\>
Generates a new list component for given model, implements its routing and adds the link to the sidebar, so the list is ready to be displayed, including pagination and filtering.

Let's explain with an example:
```
winkit angular generate|g list Foo
```
This command will generate:
##### 1. src/app/modules/foo/foo-list/
- foo-list.component.ts
- foo-list.component.html
- foo-list.component.scss

This component includes the paginated table list and the filter component.

##### 2. `foo-list` route in src/app/modules/foo/foo.routing.ts
By default the generated route is accessible just by authenticated user with ADMIN role.
<br>Every element in the table includes a link to its detail page.
##### 3. `foo-list` link in src/app/@core/sidebar/sidebar-routes.config.ts
By default the link is visible just to ADMIN users.

<a id="update-model"></a>
### winkit angular update|u model \<name\>
Updates a model based on the configuration in the _\<name\>.conf.json_ file.

([example configuration file](https://github.com/WINKgroup/winkit-cli-angular/blob/master/resources/templates/project_template/src/app/modules/user/user.conf.json))

The schema of the _\<name\>.conf.json_ configuration file is the following:
* **"properties"** (`Array<ModelProperty>`): an array of [ModelProperty](https://github.com/WINKgroup/winkit-cli-angular/tree/master/resources/templates/project_template/src/app/@core/models/ModelConfig.ts) objects.

**IMPORTANT**: To exclude a [ModelProperty](https://github.com/WINKgroup/winkit-cli-angular/tree/master/resources/templates/project_template/src/app/@core/models/ModelConfig.ts) from being updated by Winkit (ex. because you want to something custom with it), set its `skipUpdate` property to `true` (see below for more info);

<a id="model-property-structure"></a>
The structure of the [ModelProperty](https://github.com/WINKgroup/winkit-cli-angular/tree/master/resources/templates/project_template/src/app/@core/models/ModelConfig.ts) object is the following:
* **name** (`string`: _required_): the name of the model property;
* **type** (`string`: _optional_): a string containing a typescript type ([more info](https://www.typescriptlang.org/docs/handbook/basic-types.html));
* **isOptional** (`boolean`: _optional_): adds TypeScript's optional class marker to a property ([more info](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#optional-class-properties));
* **value** (`any`: _optional_): the default value assigned to the model on initialization. Setting this key results in ignoring the _type_ and _optional_ keys;
* **skipUpdate** (`boolean`: _optional_): setting this value to `true` results in the model property not being added to the model or, if it already exists on the model, skipped when the model is updated using `winkit angular update|u ...`. This also means that the property will not be added to the model detail. For info on rectifying this, see [this section](#detail-form);
* **serverName** (`string`: _optional_): name of the corresponding server model property, if different from _ModelProperty.name_;
* **serverType** (`string`: _optional_): name of the corresponding server model type, if different from _ModelProperty.type_;
* **mapReverseName** (`string`: _optional_): The name of the model property to which the server model property value should be assigned in the mapReverse method of the server model;
* **relationship** (`string`: _optional_): Maps the value of the provided model property to the current property, e.g. the following configuration: `{"name": "wid", "relationship": "id", ...}` will result in mapping the value of the `id` property to the `wid` property in the model _constructor_ and the server model _map_ method;
* **mapReverseRelationship** (`string`: _optional_): Maps the value of the provided server model property to the current property, e.g. the following configuration: `{"name": "wid", "mapReverseRelationship": "_id", ...}` will result in mapping the value of the `_id` property to the `wid` property in the server model _mapReverse_ method;
* **map** (`string`: _optional_): Contains the logic used to assign a value to the server model property inside the [Server\<Model\>.map method](#generate-model-server);
* **mapReverse** (`string`: _optional_): Contains the logic used to assign a value to the model property inside the [Server\<Model\>.mapReverse method](#generate-model-server);
* **htmlConfig** (`object`: _optional_): An object containing configuration of a single form control element. __Must be set__ for the form control element to be displayed in the detail component of a given model. For more information see [Structure of the htmlConfig object](#structure-of-the-htmlConfig-object) section below;

NOTE: The primary key property settings are not affected by the _\<name\>.conf.json_ configuration.

<a id="html-config-structure"></a>
#### STRUCTURE OF THE `htmlConfig` OBJECT

The structure of `htmlConfig` object mostly reflects [attributes of an HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Attributes) but also has some additional settings:

GENERAL

* **type** (`FormControlType | HTMLInputElement.type`): a [HTMLInputElement type](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#Form_%3Cinput%3E_types) or one of the special types listed in the [FormControlType](https://github.com/WINKgroup/winkit-cli-angular/blob/master/resources/templates/project_template/src/app/%40core/models/FormControlTypes.ts) enum;
* **ngIf** (`boolean`: _optional_): sets the value of the angular `ngIf` directive ([more info](https://angular.io/api/common/NgIf)) of the Form Element;
* **required** (`boolean`: _optional_): sets the `required` attribute of the input element;
* **disabled** (`boolean`: _optional_): sets the `disabled` attribute of the input element;
* **readonly** (`boolean`: _optional_): sets the `readonly` attribute of the input element;
* **pattern** (`boolean`: _optional_): sets the `pattern` attribute of the input element;
* **wrapperClass** (`string`: _optional_): The class of the generated HTML element. Default value: `col-sm-6 mb-3`
* **innerWrapperClass** (`string`: _optional_): The class of the `<div>` element that wraps the contents of the generated HTML element.
* **order** (`number | string`: _optional_): Sets the CSS [order property](https://developer.mozilla.org/en-US/docs/Web/CSS/order) of the form element.
* **inputFeedbackText** (`string`: _optional_): The text inside the `<small>` element, which is displayed when the value of the input is invalid. **NOTE**: Setting the `inputFeedbackText` attribute is the condition for displaying the `<small>` feedback element.
* **inputFeedbackExample** (`string`: _optional_): The italicized text  displayed in round brackets after `inputFeedbackText` inside the `<small>` element.

FORM ELEMENT TYPE: SELECT
* **options** (`Array<string | {name: string, value: any}>`: _required_): The list of `<option>` elements that will be generated inside the `<select>` element.

FORM ELEMENT TYPE: MEDIA
* **allowedTypes** (`Array<MediaType>`: _required_): Array of [MediaType enum](https://github.com/WINKgroup/winkit-cli-angular/blob/master/resources/templates/project_template/src/app/shared/components/media-manager/Media.ts) values.

FORM ELEMENT TYPE: TEXTAREA
* **rows** (`number`: _optional_): sets the `rows` attribute of the `<textarea>` element. Default value: `6`

**IMPORTANT**:
* Inside _htmlConfig_ you can use the `that` keyword to reference an external object. By default this object is the current model's detail component class (ex. _FooDetailComponent_). This is achieved by passing `this` as the 1st argument in the `<modelName>DataFactory.getFormControls()` call in `<modelName>-detail.component.ts`. To reference a different object pass it as the 1st argument instead of `this`.
* To set a string literal as a value in _htmlConfig_ wrap it in additional quotes, ex.: `"'example string literal'"`

Let's explain with an example:

**src/app/modules/foo/foo.conf.json**
```json
{
  "properties": [
    {"name": "first", "optional": true},
    {"name": "second", "type": "{id: number, [key: string]: any, someKey: SomeClass[]}"},
    {"name": "third", "value": "['some string', 1.2]"},
    {"name": "fourth", "skipUpdate": true},
    {"name": "fifth", "type": "string", "htmlConfig": {
      "type": "FormControlType.SELECT", "required": true, "options": "that.fifthPropOptions"
    }}
  ]
}
```
With the above configuration, running this command:
```
winkit angular update|u model Foo
```
will result in the following property settings in `Foo.ts` and `ServerFoo.ts` models:

##### 1. src/app/modules/foo/models/Foo.ts

```
...
id: string;
wid: string;
first?;
second: {id: number, [key: string]: any, someKey: SomeClass[]};
third = ['some string', 1.2];
fifth: string;
...
constructor()
constructor(id?: string,
            first?,
            second?: {id: number, [key: string]: any, someKey: SomeClass[]},
            third?: any,
            fifth?: string) {
    this.id = typeof id !== 'undefined' ? id : null;
    this.wid = typeof id !== 'undefined' ? id : null;
    this.first = typeof first !== 'undefined' ? first : null;
    this.second = typeof second !== 'undefined' ? second : null;
    this.third = typeof third !== 'undefined' ? third : ['some string', 1.2];
    this.fifth = typeof fifth !== 'undefined' ? fifth : null;
}
...
```
##### 2. src/app/modules/foo/models/ServerFoo.ts
```
...
_id?: string;
wid?: string;
first?;
second: {id: number, [key: string]: any, someKey: SomeClass[]};
third: any = ['some string', 1.2];
fifth: string;
...
static map(obj: Zuno): ServerZuno {
    const o = {} as ServerZuno;
    o._id = typeof obj.id !== 'undefined' ? obj.id : null;
    o.wid = typeof obj.id !== 'undefined' ? obj.id : null;
    o.first = typeof obj.first !== 'undefined' ? obj.first : null;
    o.second = typeof obj.second !== 'undefined' ? obj.second : null;
    o.third = typeof obj.third !== 'undefined' ? obj.third : null;
    o.fifth = typeof obj.fifth !== 'undefined' ? obj.fifth : null;
    return o;
}
...
static mapReverse(serverObject: ServerZuno): Zuno {
    const o = {} as Zuno;
    o.id = typeof serverObject._id !== 'undefined' ? serverObject._id : null;
    o.wid = typeof serverObject._id !== 'undefined' ? serverObject._id : null;
    o.first = typeof serverObject.first !== 'undefined' ? serverObject.first : null;
    o.second = typeof serverObject.second !== 'undefined' ? serverObject.second : null;
    o.third = typeof serverObject.third !== 'undefined' ? serverObject.third : null;
    o.fifth = typeof serverObject.fifth !== 'undefined' ? serverObject.fifth : null;
    return o;
}
...
```

##### 3. src/app/modules/foo/models/FooDataFactory.ts

```
...
static getFormControls = (that: any, customControlList: FormControlList = []): FormControlList => {
    const generatedFormControls: FormControlList = [
      {name: 'fifth', required: true, type: FormControlType.SELECT, options: that.fifthPropOptions}
    ];
...
```
# Known issues
- Strapi has been reported to not support Node.js >9 versions on certain versions of Windows. [Link to issue](https://github.com/strapi/strapi/issues/1602)
- In Strapi 3.0.0-alpha.15 and 3.0.0-alpha.16 there is a bug causing update actions of User objects to fail. For possible solutions see [this Strapi issue report](https://github.com/strapi/strapi/issues/2446)
- In Strapi 3.0.0-alpha.15 and 3.0.0-alpha.16 there is a bug causing create requests for non-User models to return a 404 error, even though instances of models are correctly created. See [this Strapi issue report](https://github.com/strapi/strapi/issues/2447)
- In Firestore the filter feature is case sensitive and must match the whole value
# What's next?
### winkit angular update|u model \<modelName\>
- Add the generated parameter to the table header in the list component

### winkit angular delete|d \<elementType\> \<modelName\>
This command will delete the model and all its associated files.
