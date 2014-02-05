Sticker.js
============


[![alt text](http://cmiscm.github.io/stickerjs/screenshot/sticker-js.jpg)](https://github.com/cmiscm/stickerjs)


A Javascript library that allows you to create a Sticker Effect.

 * No dependencies
 * Works in most of major browsers that support CSS 3 (IE10+)
 * MIT License
 
### Example
[http://stickerjs.cmiscm.com/](http://stickerjs.cmiscm.com/)

### Usage

Download the js file and include it in your html, and create sticker elements.
```html
	<!-- dom elements -->
	<div class="sticker example-1"></div>

	<div class="sticker example-2"></div>
	
    <script type="text/javascript" src="sticker.min.js"></script>
```

Add background image or background color. you can also change the shadow opacity.
```css
	.sticker {
		width: 180px;
		height: 180px;
	}

	// add image
	.example-1 .sticker-img {
		background-image: url(heroes-2.png);
	}

	// add color
	.example-2 .sticker-img {
		background-color: #ff4a85;
	}

	// change shadow opacity
	.example-2 .sticker-shadow {
		opacity: 0.6;
	}
```

Call the init() method with target elements (.className or #ID).
```js
    Sticker.init('.sticker');
```


### License
Licensed under the MIT license.

 - http://www.opensource.org/licenses/mit-license.php
