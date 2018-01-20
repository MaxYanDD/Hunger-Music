// 事件中心

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

// 歌单组件

var playlistModule = {
  init: function () {
    var _this = this
    this.$btnLeft = $('.footer .menu-left')
    this.$btnRigth = $('.footer .menu-right')
    this.$ul = $('.footer .list-box ul')
    this.$listBox = $('.footer .list-box')
    this.animaterStatus = false
    this.getdata(function(data){
      _this.render(data)
    })
    this.bind()
  },
  bind: function () {
    var _this = this
    this.$btnRigth.on('click', function(){
      if(_this.animaterStatus == true) return;
      var liWidth = _this.$ul.children().eq(0).outerWidth(true);
      var listBoxWidth = _this.$listBox.width();
      var cols = Math.floor(listBoxWidth/liWidth);

      if(parseFloat(_this.$ul.css('left'))-cols*liWidth <= -_this.$ul.width()) return;
      _this.animaterStatus = true;
      _this.$ul.animate({left: '+='+ -cols*liWidth +'px'}, 200, "linear", function(){
        _this.animaterStatus = false;
      })
    })
    this.$btnLeft.on('click', function(){
      if(_this.animaterStatus == true) return
      var liWidth = _this.$ul.children().eq(0).outerWidth(true);
      var listBoxWidth = _this.$listBox.width();
      var cols = Math.floor(listBoxWidth/liWidth);

      if(parseFloat(_this.$ul.css('left')) >= 0) {
        _this.$ul.css('left', 0);
        return;
      };
      _this.animaterStatus = true;
      _this.$ul.animate({left: '-='+ -cols*liWidth +'px'}, 200, "linear", function(){
        _this.animaterStatus = false;
      })
    })
    this.$ul.on('click', 'li', function(){
      $(this).addClass('active').siblings().removeClass('active')

      EventCenter.fire('select-albumn', {
        channelId: $(this).attr('data-channel-id'),
        channelName: $(this).attr('data-channel-name')
      })
    })
  },
  getdata: function (callback) {
    $.getJSON('http://api.jirengu.com/fm/getChannels.php').done(function(ret){
      callback(ret.channels)
    })
  },
  render: function (data){
    console.log(data)
    var temp = '';
    data.forEach(function(item){
      temp += '<li data-channel-id='+ item.channel_id +' data-channel-name='+ item.name +'>'
      temp += '<div class="songlistPic" style="background-image: url('+ item.cover_small +')"></div>'
      temp += '<h3>'+ item.name +'</h3>'
      temp += '</li>'
    })
    this.$ul.html(temp);
  }
}

var Fm = {
  init: function(){
    this.loadList();
    this.audio = new Audio();
    this.audio.autoplay = true;
    this.playPanel();

    this.channelId = 'public_tuijian_suibiantingting';
    this.channelName = '随便听听';
    this.getSong();
  },
  loadList: function(){
    var _this = this
    EventCenter.on('select-albumn', function(e){
      _this.channelId = e.detail.channelId
      _this.channelName = e.detail.channelName
      
      _this.getSong()
    })
  },
  getSong: function(){
    var _this = this
    $.getJSON('https://jirenguapi.applinzi.com/fm/getSong.php', {channel: _this.channelId}).done(function(ret){
      $('.detail .tag').text(_this.channelName)
      _this.song = ret['song'][0]
      _this.loadSongInfo()
      _this.loadLyric()
    })
  },
  loadSongInfo: function(){
    var _this = this;
    this.audio.src = this.song.url;
    $('#play').removeClass('icon-play').addClass('icon-pause')
    $('.detail h1').text(_this.song.title)
    $('.detail .author').text(_this.song.artist)
    $('.aside .pic').css('background-image', 'url('+ _this.song.picture +')')
    $('.cover').css('background-image', 'url('+ _this.song.picture +')')
  },
  loadLyric: function(){
    var _this = this
    $.getJSON('https://jirenguapi.applinzi.com/fm/getLyric.php',{sid: _this.song.sid}).done(function(ret){
      var lyricObj = {};
      ret.lyric.split('\n').forEach(function(line){
        var times = line.match(/\d{2}:\d{2}/g)
        var str = line.replace(/\[.+?\]/g, '')
        if(Array.isArray(times)){
          times.forEach(function(time){
            lyricObj[time] = str
          })
        }
      })
      console.log(lyricObj)
      _this.lyricObj = lyricObj;
    })
  },
  playPanel: function(){
    var _this = this;
    $('#play').on('click', function(){
      if(_this.audio.paused){
        _this.audio.play();
        $(this).removeClass('icon-play').addClass('icon-pause')
      }else{
        _this.audio.pause();

        $(this).removeClass('icon-pause').addClass('icon-play')
      }
    })

    $('#next').on('click', function(){
      _this.getSong()
    })

    $('#collect').on('click', function(){
      $(this).toggleClass('collected')
    })

    _this.audio.ontimeupdate = function(){
      var percentage = _this.audio.currentTime/_this.audio.duration
      var barWidth = $('.bar-progress').width()
      $('.bar-progress .progress').css('width', percentage*100 + '%')

    }

    setInterval(function(){
      if(_this.audio.paused) return;
      var min = Math.floor(_this.audio.currentTime/60)
      var sec = Math.floor(_this.audio.currentTime)%60

      sec = sec<10? ('0' + sec) : sec;

      $('#playTime').text(min + ':' + sec)
      var line = _this.lyricObj['0'+ min + ':' + sec]
      if(line){
        $('.lyric').text(line).boomText();
      }

    },1000)

    _this.audio.onended = function(){
      _this.getSong()
    }
  }
}

$.fn.boomText = function(type){
  type = type || 'rollIn'
  this.html(function(){
    var arr = $(this).text()
    .split('').map(function(word){
        return '<span class="boomText">'+ word + '</span>'
    })
    return arr.join('')
  })
  console.log(this.html())
  var index = 0
  var $boomTexts = $(this).find('span')
  var clock = setInterval(function(){
    $boomTexts.eq(index).addClass('animated ' + type)
    index++
    if(index >= $boomTexts.length){
      clearInterval(clock)
    }
  }, 300)
}

playlistModule.init();
Fm.init()
