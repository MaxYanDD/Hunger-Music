### [音乐盒](https://maxyandd.github.io/Hunger-Music/index.html)

#### 功能介绍
音乐FM，提供了歌单选择、歌词显示功能，简单易用，能适配浏览器尺寸变化。
#### 技术细节介绍
- 利用css3的vh\vw实现设备适配
- 利用@media实现响应式布局
- 使用jQuery库，对DOM对象进行操作
- 将歌单选择和歌曲播放分别封装到两个对象FM + playlistModule 
- 利用了自定义事件，使得歌单选择与歌曲播放解耦
利用JS原生的自定义事件，实现解耦，将歌单信息绑定到data对象中，当选择歌单时，触发自定义的事件将data中的歌单信息传送给FM模块.
```
var EventCenter = {
  on: function(type, handler){
    document.addEventListener(type, handler)
  },
  fire: function(type, data){
    return document.dispatchEvent(new CustomEvent(type, {
      detail: data
    }))
  }
}
```
- 利用[Animate.css](https://daneden.github.io/animate.css/)+ jQuery自定义插件实现歌词的动画效果

给歌词添加rollIn效果。
```
$.fn.boomText = function(type){
  type = type || 'rollIn'
  this.html(function(){
    var arr = $(this).text()
    .split('').map(function(word){
        return '<span class="boomText">'+ word + '</span>'
    })
    return arr.join('')
  })
  
  var index = 0
  var $boomTexts = $(this).find('span')
  var clock = setInterval(function(){
    $boomTexts.eq(index).addClass('animated ' + type)
    index++
    if(index >= $boomTexts.length){
      clearInterval(clock)
    }
  }, 200)
}
```
#### 项目收获
- 了解利用vw\vh实现屏幕适配
- 了解响应式布局
- 提升了jQuery库使用的熟练度
- 了解jQuery插件开发
- 了解自定义事件
- 了解面向对象编程

#### 技术栈关键字
jQuery、CSS3、响应式
