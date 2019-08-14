# COMMON-BOUND

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

## Authors

- **EunSu Kim** - *Server* - [eunsukimme](https://github.com/eunsukimme)
- **HyunSeo Choi** - *Client* - [HyunSeoChoi](https://github.com/HyunSeoChoi)
- **GwangHo Kim** - *API* - [FKgk](https://github.com/FKgk)

See also the list of [contributors](https://github.com/eunsukimme/Common-Bound/contributors) who participated in this project.

## License

This project is licensed under the MIT License

