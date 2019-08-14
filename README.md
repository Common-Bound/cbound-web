# COMMON-BOUND

AI Training Data Transaction Platform

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install.

- [yarn](https://yarnpkg.com/lang/en/) - JavaScript Package Manager
- [node](https://nodejs.org/ko/) - Node Package Manager

### Installing

Run projects directly on the computer (run development server)

1. Run the terminal first. (Or if you are using a vscode, you may use the built-in terminal.)
2. Clone the repository with the command below.

```
git clone https://git.swmgit.org/root/p1021_dal.git
```

3. Change the location to the replicated folder.

```
cd p1021_dal
```

4. Download the package.

```
npm install
```

​	or type

```
yarn
```

5. Enter the command ```yarn dev``` and enter localhost:3000 to see that the project is running well.

![Landing Page](https://user-images.githubusercontent.com/39645522/63000194-86194980-beab-11e9-8e08-75721bef0427.PNG)

### Coding Style

#### Introduction
In this section, you can check the the code styling, rules and commit message conventions for showdown and it's related projects. It's roughly based on [Google JavaScript Style Guide](https://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml) and AngularJS Git Commit Msg Convention. Using these rules is strongly advisable when contributing to showdown projects. 

#### Tabs and indentation
 - **DO NOT USE** tab character, use spaces instead
    - Tab size is 2 spaces
 - Indentation is 1 tab size (2 spaces)
 - Blank lines CAN be added for readability

```javascript
function foo() {
  var bar = 'bar',
      baz = 1;

  if (bar === 'bar') {
    alert('something');
  }
}
```

#### Spaces

##### Before parenthesis

  - **DO NOT ADD** before:
    - function declaration
    - function call


```javascript
function foo() {
  return 0;
}

foo();
```


  - **ADD** before:
    - 'if'
    - 'for'
    - 'while'
    - 'switch'
    - 'catch'
    - in function expression


```javascript
if (i > 10) {
  for (var j = 0; j < 10; j++) {
    switch (j) {
      case 0:
        value = 'zero';
        break;
      case 1:
        value = 'one';
        break;
    }
  }
}
```

## Deployment

Not yet under consideration

## Built With

* [React](https://ko.reactjs.org/) - Client
* [Node](https://nodejs.org/ko/) - Server
  * [Express](https://expressjs.com/ko/)

## Authors

* **EunSu Kim** - *Server* - [eunsukimme](https://github.com/eunsukimme)
* **HyunSeo Choi** - *Client* - [HyunSeoChoi](https://github.com/HyunSeoChoi)
* **Kim GwangHo** - *API* - [FKgk](https://github.com/FKgk)

See also the list of [contributors](https://github.com/eunsukimme/Common-Bound/contributors) who participated in this project.

## License

This project is licensed under the MIT License
