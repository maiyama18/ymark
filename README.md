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
<div><h1>This is header</h1><p>Hello world. <a href="http://example.com">This is link</a>. Hahaha.</p><p>Give me money.</p></div>
```