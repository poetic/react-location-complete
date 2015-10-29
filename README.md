# react-location-complete
A auto complete location component for react.

Auto complete is a meteor react auto complete component.  This allows you have have an input field that will render locations for the user to click on to select based on their typed input into the field.

# Adding to your project

Currently this component is dependant on es6 modules in meteor using the univers:modules package.
At a minimum you need to add the following packages.
`meteor add universe:modules`
`meteor add poetic:react-location-complete`
`meteor add react`
`meteor add react-template-helper`

#Usage
In your loading js file

```
import location from '{poetic:react-location-complete}';

export default function(){
  return location;
}
```

In your template:
```
<template name="sample">
  <div>
    {{> React component=location done=done}}
  </div>
</template>
```

In a js file
```
let location;

System.import('/path/to/your/component').then(function(module){
  location = module.default();
});

Template.sample.helpers({
  // this returns the react component for your template
  location(){
    return location;
  },
  // a handler function that will execute when the user clicks on a location from the list
  done(str){
    return (str) => {console.log('you chose', str); };
  }
});
```

#Overwriting styles
Due to react for the most part using inline styles if you want to override the styles of the component you must pass
a valid JavaScript style object into the component. Such as:
`{{> React component=location done=done styles=myStyleObject}}`
