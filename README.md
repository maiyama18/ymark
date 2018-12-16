# ymark

ymark is a toy markdown interpreter.

## Sample

ymark interprets `.md` files below 

```
# This is header

Hello world. [This is link](http://example.com). Hahaha.

Give me money.
```

and generate html document.

```html
<div><h1>This is header</h1><p><span>Hello world. </span></span><a href="http://example.com">This is link</a><span>. Hahaha.</span></p><p><span>Give me money.<span></p></div>
```