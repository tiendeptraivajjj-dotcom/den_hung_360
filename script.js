(function(){
    var script = {
 "mouseWheelEnabled": true,
 "layout": "absolute",
 "scrollBarWidth": 10,
 "id": "rootPlayer",
 "mobileMipmappingEnabled": false,
 "horizontalAlign": "left",
 "paddingLeft": 0,
 "scrollBarColor": "#000000",
 "paddingRight": 0,
 "start": "this.init()",
 "vrPolyfillScale": 0.5,
 "backgroundPreloadEnabled": true,
 "children": [
  "this.MainViewer"
 ],
 "borderSize": 0,
 "scrollBarVisible": "rollOver",
 "desktopMipmappingEnabled": false,
 "defaultVRPointer": "laser",
 "scripts": {
  "visibleComponentsIfPlayerFlagEnabled": function(components, playerFlag){  var enabled = this.get(playerFlag); for(var i in components){ components[i].set('visible', enabled); } },
  "autotriggerAtStart": function(playList, callback, once){  var onChange = function(event){ callback(); if(once == true) playList.unbind('change', onChange, this); }; playList.bind('change', onChange, this); },
  "getPanoramaOverlayByName": function(panorama, name){  var overlays = this.getOverlays(panorama); for(var i = 0, count = overlays.length; i<count; ++i){ var overlay = overlays[i]; var data = overlay.get('data'); if(data != undefined && data.label == name){ return overlay; } } return undefined; },
  "resumeGlobalAudios": function(caller){  if (window.pauseGlobalAudiosState == undefined || !(caller in window.pauseGlobalAudiosState)) return; var audiosPaused = window.pauseGlobalAudiosState[caller]; delete window.pauseGlobalAudiosState[caller]; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = audiosPaused.length-1; j>=0; --j) { var a = audiosPaused[j]; if(objAudios.indexOf(a) != -1) audiosPaused.splice(j, 1); } } for (var i = 0, count = audiosPaused.length; i<count; ++i) { var a = audiosPaused[i]; if (a.get('state') == 'paused') a.play(); } },
  "cloneCamera": function(camera){  var newCamera = this.rootPlayer.createInstance(camera.get('class')); newCamera.set('id', camera.get('id') + '_copy'); newCamera.set('idleSequence', camera.get('initialSequence')); return newCamera; },
  "executeFunctionWhenChange": function(playList, index, endFunction, changeFunction){  var endObject = undefined; var changePlayListFunction = function(event){ if(event.data.previousSelectedIndex == index){ if(changeFunction) changeFunction.call(this); if(endFunction && endObject) endObject.unbind('end', endFunction, this); playList.unbind('change', changePlayListFunction, this); } }; if(endFunction){ var playListItem = playList.get('items')[index]; if(playListItem.get('class') == 'PanoramaPlayListItem'){ var camera = playListItem.get('camera'); if(camera != undefined) endObject = camera.get('initialSequence'); if(endObject == undefined) endObject = camera.get('idleSequence'); } else{ endObject = playListItem.get('media'); } if(endObject){ endObject.bind('end', endFunction, this); } } playList.bind('change', changePlayListFunction, this); },
  "shareFacebook": function(url){  window.open('https://www.facebook.com/sharer/sharer.php?u=' + url, '_blank'); },
  "setPanoramaCameraWithSpot": function(playListItem, yaw, pitch){  var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); var initialPosition = newCamera.get('initialPosition'); initialPosition.set('yaw', yaw); initialPosition.set('pitch', pitch); this.startPanoramaWithCamera(panorama, newCamera); },
  "playAudioList": function(audios){  if(audios.length == 0) return; var currentAudioCount = -1; var currentAudio; var playGlobalAudioFunction = this.playGlobalAudio; var playNext = function(){ if(++currentAudioCount >= audios.length) currentAudioCount = 0; currentAudio = audios[currentAudioCount]; playGlobalAudioFunction(currentAudio, playNext); }; playNext(); },
  "openLink": function(url, name){  if(url == location.href) { return; } var isElectron = (window && window.process && window.process.versions && window.process.versions['electron']) || (navigator && navigator.userAgent && navigator.userAgent.indexOf('Electron') >= 0); if (name == '_blank' && isElectron) { if (url.startsWith('/')) { var r = window.location.href.split('/'); r.pop(); url = r.join('/') + url; } var extension = url.split('.').pop().toLowerCase(); if(extension != 'pdf' || url.startsWith('file://')) { var shell = window.require('electron').shell; shell.openExternal(url); } else { window.open(url, name); } } else if(isElectron && (name == '_top' || name == '_self')) { window.location = url; } else { var newWindow = window.open(url, name); newWindow.focus(); } },
  "shareWhatsapp": function(url){  window.open('https://api.whatsapp.com/send/?text=' + encodeURIComponent(url), '_blank'); },
  "stopAndGoCamera": function(camera, ms){  var sequence = camera.get('initialSequence'); sequence.pause(); var timeoutFunction = function(){ sequence.play(); }; setTimeout(timeoutFunction, ms); },
  "getComponentByName": function(name){  var list = this.getByClassName('UIComponent'); for(var i = 0, count = list.length; i<count; ++i){ var component = list[i]; var data = component.get('data'); if(data != undefined && data.name == name){ return component; } } return undefined; },
  "unregisterKey": function(key){  delete window[key]; },
  "getPlayListItems": function(media, player){  var itemClass = (function() { switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': return 'PanoramaPlayListItem'; case 'Video360': return 'Video360PlayListItem'; case 'PhotoAlbum': return 'PhotoAlbumPlayListItem'; case 'Map': return 'MapPlayListItem'; case 'Video': return 'VideoPlayListItem'; } })(); if (itemClass != undefined) { var items = this.getByClassName(itemClass); for (var i = items.length-1; i>=0; --i) { var item = items[i]; if(item.get('media') != media || (player != undefined && item.get('player') != player)) { items.splice(i, 1); } } return items; } else { return []; } },
  "setComponentVisibility": function(component, visible, applyAt, effect, propertyEffect, ignoreClearTimeout){  var keepVisibility = this.getKey('keepVisibility_' + component.get('id')); if(keepVisibility) return; this.unregisterKey('visibility_'+component.get('id')); var changeVisibility = function(){ if(effect && propertyEffect){ component.set(propertyEffect, effect); } component.set('visible', visible); if(component.get('class') == 'ViewerArea'){ try{ if(visible) component.restart(); else if(component.get('playbackState') == 'playing') component.pause(); } catch(e){}; } }; var effectTimeoutName = 'effectTimeout_'+component.get('id'); if(!ignoreClearTimeout && window.hasOwnProperty(effectTimeoutName)){ var effectTimeout = window[effectTimeoutName]; if(effectTimeout instanceof Array){ for(var i=0; i<effectTimeout.length; i++){ clearTimeout(effectTimeout[i]) } }else{ clearTimeout(effectTimeout); } delete window[effectTimeoutName]; } else if(visible == component.get('visible') && !ignoreClearTimeout) return; if(applyAt && applyAt > 0){ var effectTimeout = setTimeout(function(){ if(window[effectTimeoutName] instanceof Array) { var arrayTimeoutVal = window[effectTimeoutName]; var index = arrayTimeoutVal.indexOf(effectTimeout); arrayTimeoutVal.splice(index, 1); if(arrayTimeoutVal.length == 0){ delete window[effectTimeoutName]; } }else{ delete window[effectTimeoutName]; } changeVisibility(); }, applyAt); if(window.hasOwnProperty(effectTimeoutName)){ window[effectTimeoutName] = [window[effectTimeoutName], effectTimeout]; }else{ window[effectTimeoutName] = effectTimeout; } } else{ changeVisibility(); } },
  "pauseGlobalAudiosWhilePlayItem": function(playList, index, exclude){  var self = this; var item = playList.get('items')[index]; var media = item.get('media'); var player = item.get('player'); var caller = media.get('id'); var endFunc = function(){ if(playList.get('selectedIndex') != index) { if(hasState){ player.unbind('stateChange', stateChangeFunc, self); } self.resumeGlobalAudios(caller); } }; var stateChangeFunc = function(event){ var state = event.data.state; if(state == 'stopped'){ this.resumeGlobalAudios(caller); } else if(state == 'playing'){ this.pauseGlobalAudios(caller, exclude); } }; var mediaClass = media.get('class'); var hasState = mediaClass == 'Video360' || mediaClass == 'Video'; if(hasState){ player.bind('stateChange', stateChangeFunc, this); } this.pauseGlobalAudios(caller, exclude); this.executeFunctionWhenChange(playList, index, endFunc, endFunc); },
  "setStartTimeVideo": function(video, time){  var items = this.getPlayListItems(video); var startTimeBackup = []; var restoreStartTimeFunc = function() { for(var i = 0; i<items.length; ++i){ var item = items[i]; item.set('startTime', startTimeBackup[i]); item.unbind('stop', restoreStartTimeFunc, this); } }; for(var i = 0; i<items.length; ++i) { var item = items[i]; var player = item.get('player'); if(player.get('video') == video && player.get('state') == 'playing') { player.seek(time); } else { startTimeBackup.push(item.get('startTime')); item.set('startTime', time); item.bind('stop', restoreStartTimeFunc, this); } } },
  "showComponentsWhileMouseOver": function(parentComponent, components, durationVisibleWhileOut){  var setVisibility = function(visible){ for(var i = 0, length = components.length; i<length; i++){ var component = components[i]; if(component.get('class') == 'HTMLText' && (component.get('html') == '' || component.get('html') == undefined)) { continue; } component.set('visible', visible); } }; if (this.rootPlayer.get('touchDevice') == true){ setVisibility(true); } else { var timeoutID = -1; var rollOverFunction = function(){ setVisibility(true); if(timeoutID >= 0) clearTimeout(timeoutID); parentComponent.unbind('rollOver', rollOverFunction, this); parentComponent.bind('rollOut', rollOutFunction, this); }; var rollOutFunction = function(){ var timeoutFunction = function(){ setVisibility(false); parentComponent.unbind('rollOver', rollOverFunction, this); }; parentComponent.unbind('rollOut', rollOutFunction, this); parentComponent.bind('rollOver', rollOverFunction, this); timeoutID = setTimeout(timeoutFunction, durationVisibleWhileOut); }; parentComponent.bind('rollOver', rollOverFunction, this); } },
  "setStartTimeVideoSync": function(video, player){  this.setStartTimeVideo(video, player.get('currentTime')); },
  "pauseGlobalAudios": function(caller, exclude){  if (window.pauseGlobalAudiosState == undefined) window.pauseGlobalAudiosState = {}; if (window.pauseGlobalAudiosList == undefined) window.pauseGlobalAudiosList = []; if (caller in window.pauseGlobalAudiosState) { return; } var audios = this.getByClassName('Audio').concat(this.getByClassName('VideoPanoramaOverlay')); if (window.currentGlobalAudios != undefined) audios = audios.concat(Object.values(window.currentGlobalAudios)); var audiosPaused = []; var values = Object.values(window.pauseGlobalAudiosState); for (var i = 0, count = values.length; i<count; ++i) { var objAudios = values[i]; for (var j = 0; j<objAudios.length; ++j) { var a = objAudios[j]; if(audiosPaused.indexOf(a) == -1) audiosPaused.push(a); } } window.pauseGlobalAudiosState[caller] = audiosPaused; for (var i = 0, count = audios.length; i < count; ++i) { var a = audios[i]; if (a.get('state') == 'playing' && (exclude == undefined || exclude.indexOf(a) == -1)) { a.pause(); audiosPaused.push(a); } } },
  "pauseGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; } if(audio.get('state') == 'playing') audio.pause(); },
  "setMapLocation": function(panoramaPlayListItem, mapPlayer){  var resetFunction = function(){ panoramaPlayListItem.unbind('stop', resetFunction, this); player.set('mapPlayer', null); }; panoramaPlayListItem.bind('stop', resetFunction, this); var player = panoramaPlayListItem.get('player'); player.set('mapPlayer', mapPlayer); },
  "getOverlays": function(media){  switch(media.get('class')){ case 'Panorama': var overlays = media.get('overlays').concat() || []; var frames = media.get('frames'); for(var j = 0; j<frames.length; ++j){ overlays = overlays.concat(frames[j].get('overlays') || []); } return overlays; case 'Video360': case 'Map': return media.get('overlays') || []; default: return []; } },
  "setMainMediaByIndex": function(index){  var item = undefined; if(index >= 0 && index < this.mainPlayList.get('items').length){ this.mainPlayList.set('selectedIndex', index); item = this.mainPlayList.get('items')[index]; } return item; },
  "historyGoForward": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.forward(); } },
  "getMediaHeight": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxH=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('height') > maxH) maxH = r.get('height'); } return maxH; }else{ return r.get('height') } default: return media.get('height'); } },
  "showWindow": function(w, autoCloseMilliSeconds, containsAudio){  if(w.get('visible') == true){ return; } var closeFunction = function(){ clearAutoClose(); this.resumePlayers(playersPaused, !containsAudio); w.unbind('close', closeFunction, this); }; var clearAutoClose = function(){ w.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ w.hide(); }; w.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } var playersPaused = this.pauseCurrentPlayers(!containsAudio); w.bind('close', closeFunction, this); w.show(this, true); },
  "registerKey": function(key, value){  window[key] = value; },
  "getMediaFromPlayer": function(player){  switch(player.get('class')){ case 'PanoramaPlayer': return player.get('panorama') || player.get('video'); case 'VideoPlayer': case 'Video360Player': return player.get('video'); case 'PhotoAlbumPlayer': return player.get('photoAlbum'); case 'MapPlayer': return player.get('map'); } },
  "updateMediaLabelFromPlayList": function(playList, htmlText, playListItemStopToDispose){  var changeFunction = function(){ var index = playList.get('selectedIndex'); if(index >= 0){ var beginFunction = function(){ playListItem.unbind('begin', beginFunction); setMediaLabel(index); }; var setMediaLabel = function(index){ var media = playListItem.get('media'); var text = media.get('data'); if(!text) text = media.get('label'); setHtml(text); }; var setHtml = function(text){ if(text !== undefined) { htmlText.set('html', '<div style=\"text-align:left\"><SPAN STYLE=\"color:#FFFFFF;font-size:12px;font-family:Verdana\"><span color=\"white\" font-family=\"Verdana\" font-size=\"12px\">' + text + '</SPAN></div>'); } else { htmlText.set('html', ''); } }; var playListItem = playList.get('items')[index]; if(htmlText.get('html')){ setHtml('Loading...'); playListItem.bind('begin', beginFunction); } else{ setMediaLabel(index); } } }; var disposeFunction = function(){ htmlText.set('html', undefined); playList.unbind('change', changeFunction, this); playListItemStopToDispose.unbind('stop', disposeFunction, this); }; if(playListItemStopToDispose){ playListItemStopToDispose.bind('stop', disposeFunction, this); } playList.bind('change', changeFunction, this); changeFunction(); },
  "getPixels": function(value){  var result = new RegExp('((\\+|\\-)?\\d+(\\.\\d*)?)(px|vw|vh|vmin|vmax)?', 'i').exec(value); if (result == undefined) { return 0; } var num = parseFloat(result[1]); var unit = result[4]; var vw = this.rootPlayer.get('actualWidth') / 100; var vh = this.rootPlayer.get('actualHeight') / 100; switch(unit) { case 'vw': return num * vw; case 'vh': return num * vh; case 'vmin': return num * Math.min(vw, vh); case 'vmax': return num * Math.max(vw, vh); default: return num; } },
  "playGlobalAudioWhilePlay": function(playList, index, audio, endCallback){  var changeFunction = function(event){ if(event.data.previousSelectedIndex == index){ this.stopGlobalAudio(audio); if(isPanorama) { var media = playListItem.get('media'); var audios = media.get('audios'); audios.splice(audios.indexOf(audio), 1); media.set('audios', audios); } playList.unbind('change', changeFunction, this); if(endCallback) endCallback(); } }; var audios = window.currentGlobalAudios; if(audios && audio.get('id') in audios){ audio = audios[audio.get('id')]; if(audio.get('state') != 'playing'){ audio.play(); } return audio; } playList.bind('change', changeFunction, this); var playListItem = playList.get('items')[index]; var isPanorama = playListItem.get('class') == 'PanoramaPlayListItem'; if(isPanorama) { var media = playListItem.get('media'); var audios = (media.get('audios') || []).slice(); if(audio.get('class') == 'MediaAudio') { var panoramaAudio = this.rootPlayer.createInstance('PanoramaAudio'); panoramaAudio.set('autoplay', false); panoramaAudio.set('audio', audio.get('audio')); panoramaAudio.set('loop', audio.get('loop')); panoramaAudio.set('id', audio.get('id')); var stateChangeFunctions = audio.getBindings('stateChange'); for(var i = 0; i<stateChangeFunctions.length; ++i){ var f = stateChangeFunctions[i]; if(typeof f == 'string') f = new Function('event', f); panoramaAudio.bind('stateChange', f, this); } audio = panoramaAudio; } audios.push(audio); media.set('audios', audios); } return this.playGlobalAudio(audio, endCallback); },
  "syncPlaylists": function(playLists){  var changeToMedia = function(media, playListDispatched){ for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(playList != playListDispatched){ var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ if(items[j].get('media') == media){ if(playList.get('selectedIndex') != j){ playList.set('selectedIndex', j); } break; } } } } }; var changeFunction = function(event){ var playListDispatched = event.source; var selectedIndex = playListDispatched.get('selectedIndex'); if(selectedIndex < 0) return; var media = playListDispatched.get('items')[selectedIndex].get('media'); changeToMedia(media, playListDispatched); }; var mapPlayerChangeFunction = function(event){ var panoramaMapLocation = event.source.get('panoramaMapLocation'); if(panoramaMapLocation){ var map = panoramaMapLocation.get('map'); changeToMedia(map); } }; for(var i = 0, count = playLists.length; i<count; ++i){ playLists[i].bind('change', changeFunction, this); } var mapPlayers = this.getByClassName('MapPlayer'); for(var i = 0, count = mapPlayers.length; i<count; ++i){ mapPlayers[i].bind('panoramaMapLocation_change', mapPlayerChangeFunction, this); } },
  "isCardboardViewMode": function(){  var players = this.getByClassName('PanoramaPlayer'); return players.length > 0 && players[0].get('viewMode') == 'cardboard'; },
  "init": function(){  if(!Object.hasOwnProperty('values')) { Object.values = function(o){ return Object.keys(o).map(function(e) { return o[e]; }); }; } var history = this.get('data')['history']; var playListChangeFunc = function(e){ var playList = e.source; var index = playList.get('selectedIndex'); if(index < 0) return; var id = playList.get('id'); if(!history.hasOwnProperty(id)) history[id] = new HistoryData(playList); history[id].add(index); }; var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i) { var playList = playLists[i]; playList.bind('change', playListChangeFunc, this); } },
  "setCameraSameSpotAsMedia": function(camera, media){  var player = this.getCurrentPlayerWithMedia(media); if(player != undefined) { var position = camera.get('initialPosition'); position.set('yaw', player.get('yaw')); position.set('pitch', player.get('pitch')); position.set('hfov', player.get('hfov')); } },
  "getActivePlayerWithViewer": function(viewerArea){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); players = players.concat(this.getByClassName('MapPlayer')); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('viewerArea') == viewerArea) { var playerClass = player.get('class'); if(playerClass == 'PanoramaPlayer' && (player.get('panorama') != undefined || player.get('video') != undefined)) return player; else if((playerClass == 'VideoPlayer' || playerClass == 'Video360Player') && player.get('video') != undefined) return player; else if(playerClass == 'PhotoAlbumPlayer' && player.get('photoAlbum') != undefined) return player; else if(playerClass == 'MapPlayer' && player.get('map') != undefined) return player; } } return undefined; },
  "getPlayListItemByMedia": function(playList, media){  var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media) return item; } return undefined; },
  "showPopupMedia": function(w, media, playList, popupMaxWidth, popupMaxHeight, autoCloseWhenFinished, stopAudios){  var self = this; var closeFunction = function(){ playList.set('selectedIndex', -1); self.MainViewer.set('toolTipEnabled', true); if(stopAudios) { self.resumeGlobalAudios(); } this.resumePlayers(playersPaused, !stopAudios); if(isVideo) { this.unbind('resize', resizeFunction, this); } w.unbind('close', closeFunction, this); }; var endFunction = function(){ w.hide(); }; var resizeFunction = function(){ var getWinValue = function(property){ return w.get(property) || 0; }; var parentWidth = self.get('actualWidth'); var parentHeight = self.get('actualHeight'); var mediaWidth = self.getMediaWidth(media); var mediaHeight = self.getMediaHeight(media); var popupMaxWidthNumber = parseFloat(popupMaxWidth) / 100; var popupMaxHeightNumber = parseFloat(popupMaxHeight) / 100; var windowWidth = popupMaxWidthNumber * parentWidth; var windowHeight = popupMaxHeightNumber * parentHeight; var footerHeight = getWinValue('footerHeight'); var headerHeight = getWinValue('headerHeight'); if(!headerHeight) { var closeButtonHeight = getWinValue('closeButtonIconHeight') + getWinValue('closeButtonPaddingTop') + getWinValue('closeButtonPaddingBottom'); var titleHeight = self.getPixels(getWinValue('titleFontSize')) + getWinValue('titlePaddingTop') + getWinValue('titlePaddingBottom'); headerHeight = closeButtonHeight > titleHeight ? closeButtonHeight : titleHeight; headerHeight += getWinValue('headerPaddingTop') + getWinValue('headerPaddingBottom'); } var contentWindowWidth = windowWidth - getWinValue('bodyPaddingLeft') - getWinValue('bodyPaddingRight') - getWinValue('paddingLeft') - getWinValue('paddingRight'); var contentWindowHeight = windowHeight - headerHeight - footerHeight - getWinValue('bodyPaddingTop') - getWinValue('bodyPaddingBottom') - getWinValue('paddingTop') - getWinValue('paddingBottom'); var parentAspectRatio = contentWindowWidth / contentWindowHeight; var mediaAspectRatio = mediaWidth / mediaHeight; if(parentAspectRatio > mediaAspectRatio) { windowWidth = contentWindowHeight * mediaAspectRatio + getWinValue('bodyPaddingLeft') + getWinValue('bodyPaddingRight') + getWinValue('paddingLeft') + getWinValue('paddingRight'); } else { windowHeight = contentWindowWidth / mediaAspectRatio + headerHeight + footerHeight + getWinValue('bodyPaddingTop') + getWinValue('bodyPaddingBottom') + getWinValue('paddingTop') + getWinValue('paddingBottom'); } if(windowWidth > parentWidth * popupMaxWidthNumber) { windowWidth = parentWidth * popupMaxWidthNumber; } if(windowHeight > parentHeight * popupMaxHeightNumber) { windowHeight = parentHeight * popupMaxHeightNumber; } w.set('width', windowWidth); w.set('height', windowHeight); w.set('x', (parentWidth - getWinValue('actualWidth')) * 0.5); w.set('y', (parentHeight - getWinValue('actualHeight')) * 0.5); }; if(autoCloseWhenFinished){ this.executeFunctionWhenChange(playList, 0, endFunction); } var mediaClass = media.get('class'); var isVideo = mediaClass == 'Video' || mediaClass == 'Video360'; playList.set('selectedIndex', 0); if(isVideo){ this.bind('resize', resizeFunction, this); resizeFunction(); playList.get('items')[0].get('player').play(); } else { w.set('width', popupMaxWidth); w.set('height', popupMaxHeight); } this.MainViewer.set('toolTipEnabled', false); if(stopAudios) { this.pauseGlobalAudios(); } var playersPaused = this.pauseCurrentPlayers(!stopAudios); w.bind('close', closeFunction, this); w.show(this, true); },
  "resumePlayers": function(players, onlyResumeCameraIfPanorama){  for(var i = 0; i<players.length; ++i){ var player = players[i]; if(onlyResumeCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.resumeCamera(); } else{ player.play(); } } },
  "historyGoBack": function(playList){  var history = this.get('data')['history'][playList.get('id')]; if(history != undefined) { history.back(); } },
  "existsKey": function(key){  return key in window; },
  "getMediaByName": function(name){  var list = this.getByClassName('Media'); for(var i = 0, count = list.length; i<count; ++i){ var media = list[i]; if((media.get('class') == 'Audio' && media.get('data').label == name) || media.get('label') == name){ return media; } } return undefined; },
  "updateVideoCues": function(playList, index){  var playListItem = playList.get('items')[index]; var video = playListItem.get('media'); if(video.get('cues').length == 0) return; var player = playListItem.get('player'); var cues = []; var changeFunction = function(){ if(playList.get('selectedIndex') != index){ video.unbind('cueChange', cueChangeFunction, this); playList.unbind('change', changeFunction, this); } }; var cueChangeFunction = function(event){ var activeCues = event.data.activeCues; for(var i = 0, count = cues.length; i<count; ++i){ var cue = cues[i]; if(activeCues.indexOf(cue) == -1 && (cue.get('startTime') > player.get('currentTime') || cue.get('endTime') < player.get('currentTime')+0.5)){ cue.trigger('end'); } } cues = activeCues; }; video.bind('cueChange', cueChangeFunction, this); playList.bind('change', changeFunction, this); },
  "changeBackgroundWhilePlay": function(playList, index, color){  var stopFunction = function(event){ playListItem.unbind('stop', stopFunction, this); if((color == viewerArea.get('backgroundColor')) && (colorRatios == viewerArea.get('backgroundColorRatios'))){ viewerArea.set('backgroundColor', backgroundColorBackup); viewerArea.set('backgroundColorRatios', backgroundColorRatiosBackup); } }; var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var viewerArea = player.get('viewerArea'); var backgroundColorBackup = viewerArea.get('backgroundColor'); var backgroundColorRatiosBackup = viewerArea.get('backgroundColorRatios'); var colorRatios = [0]; if((color != backgroundColorBackup) || (colorRatios != backgroundColorRatiosBackup)){ viewerArea.set('backgroundColor', color); viewerArea.set('backgroundColorRatios', colorRatios); playListItem.bind('stop', stopFunction, this); } },
  "pauseCurrentPlayers": function(onlyPauseCameraIfPanorama){  var players = this.getCurrentPlayers(); var i = players.length; while(i-- > 0){ var player = players[i]; if(player.get('state') == 'playing') { if(onlyPauseCameraIfPanorama && player.get('class') == 'PanoramaPlayer' && typeof player.get('video') === 'undefined'){ player.pauseCamera(); } else { player.pause(); } } else { players.splice(i, 1); } } return players; },
  "playGlobalAudio": function(audio, endCallback){  var endFunction = function(){ audio.unbind('end', endFunction, this); this.stopGlobalAudio(audio); if(endCallback) endCallback(); }; audio = this.getGlobalAudio(audio); var audios = window.currentGlobalAudios; if(!audios){ audios = window.currentGlobalAudios = {}; } audios[audio.get('id')] = audio; if(audio.get('state') == 'playing'){ return audio; } if(!audio.get('loop')){ audio.bind('end', endFunction, this); } audio.play(); return audio; },
  "setMediaBehaviour": function(playList, index, mediaDispatcher){  var self = this; var stateChangeFunction = function(event){ if(event.data.state == 'stopped'){ dispose.call(this, true); } }; var onBeginFunction = function() { item.unbind('begin', onBeginFunction, self); var media = item.get('media'); if(media.get('class') != 'Panorama' || (media.get('camera') != undefined && media.get('camera').get('initialSequence') != undefined)){ player.bind('stateChange', stateChangeFunction, self); } }; var changeFunction = function(){ var index = playListDispatcher.get('selectedIndex'); if(index != -1){ indexDispatcher = index; dispose.call(this, false); } }; var disposeCallback = function(){ dispose.call(this, false); }; var dispose = function(forceDispose){ if(!playListDispatcher) return; var media = item.get('media'); if((media.get('class') == 'Video360' || media.get('class') == 'Video') && media.get('loop') == true && !forceDispose) return; playList.set('selectedIndex', -1); if(panoramaSequence && panoramaSequenceIndex != -1){ if(panoramaSequence) { if(panoramaSequenceIndex > 0 && panoramaSequence.get('movements')[panoramaSequenceIndex-1].get('class') == 'TargetPanoramaCameraMovement'){ var initialPosition = camera.get('initialPosition'); var oldYaw = initialPosition.get('yaw'); var oldPitch = initialPosition.get('pitch'); var oldHfov = initialPosition.get('hfov'); var previousMovement = panoramaSequence.get('movements')[panoramaSequenceIndex-1]; initialPosition.set('yaw', previousMovement.get('targetYaw')); initialPosition.set('pitch', previousMovement.get('targetPitch')); initialPosition.set('hfov', previousMovement.get('targetHfov')); var restoreInitialPositionFunction = function(event){ initialPosition.set('yaw', oldYaw); initialPosition.set('pitch', oldPitch); initialPosition.set('hfov', oldHfov); itemDispatcher.unbind('end', restoreInitialPositionFunction, this); }; itemDispatcher.bind('end', restoreInitialPositionFunction, this); } panoramaSequence.set('movementIndex', panoramaSequenceIndex); } } if(player){ item.unbind('begin', onBeginFunction, this); player.unbind('stateChange', stateChangeFunction, this); for(var i = 0; i<buttons.length; ++i) { buttons[i].unbind('click', disposeCallback, this); } } if(sameViewerArea){ var currentMedia = this.getMediaFromPlayer(player); if(currentMedia == undefined || currentMedia == item.get('media')){ playListDispatcher.set('selectedIndex', indexDispatcher); } if(playList != playListDispatcher) playListDispatcher.unbind('change', changeFunction, this); } else{ viewerArea.set('visible', viewerVisibility); } playListDispatcher = undefined; }; var mediaDispatcherByParam = mediaDispatcher != undefined; if(!mediaDispatcher){ var currentIndex = playList.get('selectedIndex'); var currentPlayer = (currentIndex != -1) ? playList.get('items')[playList.get('selectedIndex')].get('player') : this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer) { mediaDispatcher = this.getMediaFromPlayer(currentPlayer); } } var playListDispatcher = mediaDispatcher ? this.getPlayListWithMedia(mediaDispatcher, true) : undefined; if(!playListDispatcher){ playList.set('selectedIndex', index); return; } var indexDispatcher = playListDispatcher.get('selectedIndex'); if(playList.get('selectedIndex') == index || indexDispatcher == -1){ return; } var item = playList.get('items')[index]; var itemDispatcher = playListDispatcher.get('items')[indexDispatcher]; var player = item.get('player'); var viewerArea = player.get('viewerArea'); var viewerVisibility = viewerArea.get('visible'); var sameViewerArea = viewerArea == itemDispatcher.get('player').get('viewerArea'); if(sameViewerArea){ if(playList != playListDispatcher){ playListDispatcher.set('selectedIndex', -1); playListDispatcher.bind('change', changeFunction, this); } } else{ viewerArea.set('visible', true); } var panoramaSequenceIndex = -1; var panoramaSequence = undefined; var camera = itemDispatcher.get('camera'); if(camera){ panoramaSequence = camera.get('initialSequence'); if(panoramaSequence) { panoramaSequenceIndex = panoramaSequence.get('movementIndex'); } } playList.set('selectedIndex', index); var buttons = []; var addButtons = function(property){ var value = player.get(property); if(value == undefined) return; if(Array.isArray(value)) buttons = buttons.concat(value); else buttons.push(value); }; addButtons('buttonStop'); for(var i = 0; i<buttons.length; ++i) { buttons[i].bind('click', disposeCallback, this); } if(player != itemDispatcher.get('player') || !mediaDispatcherByParam){ item.bind('begin', onBeginFunction, self); } this.executeFunctionWhenChange(playList, index, disposeCallback); },
  "loadFromCurrentMediaPlayList": function(playList, delta){  var currentIndex = playList.get('selectedIndex'); var totalItems = playList.get('items').length; var newIndex = (currentIndex + delta) % totalItems; while(newIndex < 0){ newIndex = totalItems + newIndex; }; if(currentIndex != newIndex){ playList.set('selectedIndex', newIndex); } },
  "getMediaWidth": function(media){  switch(media.get('class')){ case 'Video360': var res = media.get('video'); if(res instanceof Array){ var maxW=0; for(var i=0; i<res.length; i++){ var r = res[i]; if(r.get('width') > maxW) maxW = r.get('width'); } return maxW; }else{ return r.get('width') } default: return media.get('width'); } },
  "triggerOverlay": function(overlay, eventName){  if(overlay.get('areas') != undefined) { var areas = overlay.get('areas'); for(var i = 0; i<areas.length; ++i) { areas[i].trigger(eventName); } } else { overlay.trigger(eventName); } },
  "changePlayListWithSameSpot": function(playList, newIndex){  var currentIndex = playList.get('selectedIndex'); if (currentIndex >= 0 && newIndex >= 0 && currentIndex != newIndex) { var currentItem = playList.get('items')[currentIndex]; var newItem = playList.get('items')[newIndex]; var currentPlayer = currentItem.get('player'); var newPlayer = newItem.get('player'); if ((currentPlayer.get('class') == 'PanoramaPlayer' || currentPlayer.get('class') == 'Video360Player') && (newPlayer.get('class') == 'PanoramaPlayer' || newPlayer.get('class') == 'Video360Player')) { var newCamera = this.cloneCamera(newItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, currentItem.get('media')); this.startPanoramaWithCamera(newItem.get('media'), newCamera); } } },
  "loopAlbum": function(playList, index){  var playListItem = playList.get('items')[index]; var player = playListItem.get('player'); var loopFunction = function(){ player.play(); }; this.executeFunctionWhenChange(playList, index, loopFunction); },
  "showPopupPanoramaVideoOverlay": function(popupPanoramaOverlay, closeButtonProperties, stopAudios){  var self = this; var showEndFunction = function() { popupPanoramaOverlay.unbind('showEnd', showEndFunction); closeButton.bind('click', hideFunction, this); setCloseButtonPosition(); closeButton.set('visible', true); }; var endFunction = function() { if(!popupPanoramaOverlay.get('loop')) hideFunction(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); popupPanoramaOverlay.set('visible', false); closeButton.set('visible', false); closeButton.unbind('click', hideFunction, self); popupPanoramaOverlay.unbind('end', endFunction, self); popupPanoramaOverlay.unbind('hideEnd', hideFunction, self, true); self.resumePlayers(playersPaused, true); if(stopAudios) { self.resumeGlobalAudios(); } }; var setCloseButtonPosition = function() { var right = 10; var top = 10; closeButton.set('right', right); closeButton.set('top', top); }; this.MainViewer.set('toolTipEnabled', false); var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(true); if(stopAudios) { this.pauseGlobalAudios(); } popupPanoramaOverlay.bind('end', endFunction, this, true); popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); popupPanoramaOverlay.bind('hideEnd', hideFunction, this, true); popupPanoramaOverlay.set('visible', true); },
  "getCurrentPlayers": function(){  var players = this.getByClassName('PanoramaPlayer'); players = players.concat(this.getByClassName('VideoPlayer')); players = players.concat(this.getByClassName('Video360Player')); players = players.concat(this.getByClassName('PhotoAlbumPlayer')); return players; },
  "setPanoramaCameraWithCurrentSpot": function(playListItem){  var currentPlayer = this.getActivePlayerWithViewer(this.MainViewer); if(currentPlayer == undefined){ return; } var playerClass = currentPlayer.get('class'); if(playerClass != 'PanoramaPlayer' && playerClass != 'Video360Player'){ return; } var fromMedia = currentPlayer.get('panorama'); if(fromMedia == undefined) { fromMedia = currentPlayer.get('video'); } var panorama = playListItem.get('media'); var newCamera = this.cloneCamera(playListItem.get('camera')); this.setCameraSameSpotAsMedia(newCamera, fromMedia); this.startPanoramaWithCamera(panorama, newCamera); },
  "getGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios != undefined && audio.get('id') in audios){ audio = audios[audio.get('id')]; } return audio; },
  "getPlayListWithMedia": function(media, onlySelected){  var playLists = this.getByClassName('PlayList'); for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; if(onlySelected && playList.get('selectedIndex') == -1) continue; if(this.getPlayListItemByMedia(playList, media) != undefined) return playList; } return undefined; },
  "stopGlobalAudio": function(audio){  var audios = window.currentGlobalAudios; if(audios){ audio = audios[audio.get('id')]; if(audio){ delete audios[audio.get('id')]; if(Object.keys(audios).length == 0){ window.currentGlobalAudios = undefined; } } } if(audio) audio.stop(); },
  "setOverlayBehaviour": function(overlay, media, action){  var executeFunc = function() { switch(action){ case 'triggerClick': this.triggerOverlay(overlay, 'click'); break; case 'stop': case 'play': case 'pause': overlay[action](); break; case 'togglePlayPause': case 'togglePlayStop': if(overlay.get('state') == 'playing') overlay[action == 'togglePlayPause' ? 'pause' : 'stop'](); else overlay.play(); break; } if(window.overlaysDispatched == undefined) window.overlaysDispatched = {}; var id = overlay.get('id'); window.overlaysDispatched[id] = true; setTimeout(function(){ delete window.overlaysDispatched[id]; }, 2000); }; if(window.overlaysDispatched != undefined && overlay.get('id') in window.overlaysDispatched) return; var playList = this.getPlayListWithMedia(media, true); if(playList != undefined){ var item = this.getPlayListItemByMedia(playList, media); if(playList.get('items').indexOf(item) != playList.get('selectedIndex')){ var beginFunc = function(e){ item.unbind('begin', beginFunc, this); executeFunc.call(this); }; item.bind('begin', beginFunc, this); return; } } executeFunc.call(this); },
  "fixTogglePlayPauseButton": function(player){  var state = player.get('state'); var buttons = player.get('buttonPlayPause'); if(typeof buttons !== 'undefined' && player.get('state') == 'playing'){ if(!Array.isArray(buttons)) buttons = [buttons]; for(var i = 0; i<buttons.length; ++i) buttons[i].set('pressed', true); } },
  "setEndToItemIndex": function(playList, fromIndex, toIndex){  var endFunction = function(){ if(playList.get('selectedIndex') == fromIndex) playList.set('selectedIndex', toIndex); }; this.executeFunctionWhenChange(playList, fromIndex, endFunction); },
  "startPanoramaWithCamera": function(media, camera){  if(window.currentPanoramasWithCameraChanged != undefined && window.currentPanoramasWithCameraChanged.indexOf(media) != -1){ return; } var playLists = this.getByClassName('PlayList'); if(playLists.length == 0) return; var restoreItems = []; for(var i = 0, count = playLists.length; i<count; ++i){ var playList = playLists[i]; var items = playList.get('items'); for(var j = 0, countJ = items.length; j<countJ; ++j){ var item = items[j]; if(item.get('media') == media && (item.get('class') == 'PanoramaPlayListItem' || item.get('class') == 'Video360PlayListItem')){ restoreItems.push({camera: item.get('camera'), item: item}); item.set('camera', camera); } } } if(restoreItems.length > 0) { if(window.currentPanoramasWithCameraChanged == undefined) { window.currentPanoramasWithCameraChanged = [media]; } else { window.currentPanoramasWithCameraChanged.push(media); } var restoreCameraOnStop = function(){ var index = window.currentPanoramasWithCameraChanged.indexOf(media); if(index != -1) { window.currentPanoramasWithCameraChanged.splice(index, 1); } for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.set('camera', restoreItems[i].camera); restoreItems[i].item.unbind('stop', restoreCameraOnStop, this); } }; for (var i = 0; i < restoreItems.length; i++) { restoreItems[i].item.bind('stop', restoreCameraOnStop, this); } } },
  "initGA": function(){  var sendFunc = function(category, event, label) { ga('send', 'event', category, event, label); }; var media = this.getByClassName('Panorama'); media = media.concat(this.getByClassName('Video360')); media = media.concat(this.getByClassName('Map')); for(var i = 0, countI = media.length; i<countI; ++i){ var m = media[i]; var mediaLabel = m.get('label'); var overlays = this.getOverlays(m); for(var j = 0, countJ = overlays.length; j<countJ; ++j){ var overlay = overlays[j]; var overlayLabel = overlay.get('data') != undefined ? mediaLabel + ' - ' + overlay.get('data')['label'] : mediaLabel; switch(overlay.get('class')) { case 'HotspotPanoramaOverlay': case 'HotspotMapOverlay': var areas = overlay.get('areas'); for (var z = 0; z<areas.length; ++z) { areas[z].bind('click', sendFunc.bind(this, 'Hotspot', 'click', overlayLabel), this); } break; case 'CeilingCapPanoramaOverlay': case 'TripodCapPanoramaOverlay': overlay.bind('click', sendFunc.bind(this, 'Cap', 'click', overlayLabel), this); break; } } } var components = this.getByClassName('Button'); components = components.concat(this.getByClassName('IconButton')); for(var i = 0, countI = components.length; i<countI; ++i){ var c = components[i]; var componentLabel = c.get('data')['name']; c.bind('click', sendFunc.bind(this, 'Skin', 'click', componentLabel), this); } var items = this.getByClassName('PlayListItem'); var media2Item = {}; for(var i = 0, countI = items.length; i<countI; ++i) { var item = items[i]; var media = item.get('media'); if(!(media.get('id') in media2Item)) { item.bind('begin', sendFunc.bind(this, 'Media', 'play', media.get('label')), this); media2Item[media.get('id')] = item; } } },
  "showPopupPanoramaOverlay": function(popupPanoramaOverlay, closeButtonProperties, imageHD, toggleImage, toggleImageHD, autoCloseMilliSeconds, audio, stopBackgroundAudio){  var self = this; this.MainViewer.set('toolTipEnabled', false); var cardboardEnabled = this.isCardboardViewMode(); if(!cardboardEnabled) { var zoomImage = this.zoomImagePopupPanorama; var showDuration = popupPanoramaOverlay.get('showDuration'); var hideDuration = popupPanoramaOverlay.get('hideDuration'); var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); var popupMaxWidthBackup = popupPanoramaOverlay.get('popupMaxWidth'); var popupMaxHeightBackup = popupPanoramaOverlay.get('popupMaxHeight'); var showEndFunction = function() { var loadedFunction = function(){ if(!self.isCardboardViewMode()) popupPanoramaOverlay.set('visible', false); }; popupPanoramaOverlay.unbind('showEnd', showEndFunction, self); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', 1); self.showPopupImage(imageHD, toggleImageHD, popupPanoramaOverlay.get('popupMaxWidth'), popupPanoramaOverlay.get('popupMaxHeight'), null, null, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedFunction, hideFunction); }; var hideFunction = function() { var restoreShowDurationFunction = function(){ popupPanoramaOverlay.unbind('showEnd', restoreShowDurationFunction, self); popupPanoramaOverlay.set('visible', false); popupPanoramaOverlay.set('showDuration', showDuration); popupPanoramaOverlay.set('popupMaxWidth', popupMaxWidthBackup); popupPanoramaOverlay.set('popupMaxHeight', popupMaxHeightBackup); }; self.resumePlayers(playersPaused, audio == null || !stopBackgroundAudio); var currentWidth = zoomImage.get('imageWidth'); var currentHeight = zoomImage.get('imageHeight'); popupPanoramaOverlay.bind('showEnd', restoreShowDurationFunction, self, true); popupPanoramaOverlay.set('showDuration', 1); popupPanoramaOverlay.set('hideDuration', hideDuration); popupPanoramaOverlay.set('popupMaxWidth', currentWidth); popupPanoramaOverlay.set('popupMaxHeight', currentHeight); if(popupPanoramaOverlay.get('visible')) restoreShowDurationFunction(); else popupPanoramaOverlay.set('visible', true); self.MainViewer.set('toolTipEnabled', true); }; if(!imageHD){ imageHD = popupPanoramaOverlay.get('image'); } if(!toggleImageHD && toggleImage){ toggleImageHD = toggleImage; } popupPanoramaOverlay.bind('showEnd', showEndFunction, this, true); } else { var hideEndFunction = function() { self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } popupPanoramaOverlay.unbind('hideEnd', hideEndFunction, self); self.MainViewer.set('toolTipEnabled', true); }; var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } popupPanoramaOverlay.bind('hideEnd', hideEndFunction, this, true); } popupPanoramaOverlay.set('visible', true); },
  "showPopupImage": function(image, toggleImage, customWidth, customHeight, showEffect, hideEffect, closeButtonProperties, autoCloseMilliSeconds, audio, stopBackgroundAudio, loadedCallback, hideCallback){  var self = this; var closed = false; var playerClickFunction = function() { zoomImage.unbind('loaded', loadedFunction, self); hideFunction(); }; var clearAutoClose = function(){ zoomImage.unbind('click', clearAutoClose, this); if(timeoutID != undefined){ clearTimeout(timeoutID); } }; var resizeFunction = function(){ setTimeout(setCloseButtonPosition, 0); }; var loadedFunction = function(){ self.unbind('click', playerClickFunction, self); veil.set('visible', true); setCloseButtonPosition(); closeButton.set('visible', true); zoomImage.unbind('loaded', loadedFunction, this); zoomImage.bind('userInteractionStart', userInteractionStartFunction, this); zoomImage.bind('userInteractionEnd', userInteractionEndFunction, this); zoomImage.bind('resize', resizeFunction, this); timeoutID = setTimeout(timeoutFunction, 200); }; var timeoutFunction = function(){ timeoutID = undefined; if(autoCloseMilliSeconds){ var autoCloseFunction = function(){ hideFunction(); }; zoomImage.bind('click', clearAutoClose, this); timeoutID = setTimeout(autoCloseFunction, autoCloseMilliSeconds); } zoomImage.bind('backgroundClick', hideFunction, this); if(toggleImage) { zoomImage.bind('click', toggleFunction, this); zoomImage.set('imageCursor', 'hand'); } closeButton.bind('click', hideFunction, this); if(loadedCallback) loadedCallback(); }; var hideFunction = function() { self.MainViewer.set('toolTipEnabled', true); closed = true; if(timeoutID) clearTimeout(timeoutID); if (timeoutUserInteractionID) clearTimeout(timeoutUserInteractionID); if(autoCloseMilliSeconds) clearAutoClose(); if(hideCallback) hideCallback(); zoomImage.set('visible', false); if(hideEffect && hideEffect.get('duration') > 0){ hideEffect.bind('end', endEffectFunction, this); } else{ zoomImage.set('image', null); } closeButton.set('visible', false); veil.set('visible', false); self.unbind('click', playerClickFunction, self); zoomImage.unbind('backgroundClick', hideFunction, this); zoomImage.unbind('userInteractionStart', userInteractionStartFunction, this); zoomImage.unbind('userInteractionEnd', userInteractionEndFunction, this, true); zoomImage.unbind('resize', resizeFunction, this); if(toggleImage) { zoomImage.unbind('click', toggleFunction, this); zoomImage.set('cursor', 'default'); } closeButton.unbind('click', hideFunction, this); self.resumePlayers(playersPaused, audio == null || stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ self.resumeGlobalAudios(); } self.stopGlobalAudio(audio); } }; var endEffectFunction = function() { zoomImage.set('image', null); hideEffect.unbind('end', endEffectFunction, this); }; var toggleFunction = function() { zoomImage.set('image', isToggleVisible() ? image : toggleImage); }; var isToggleVisible = function() { return zoomImage.get('image') == toggleImage; }; var setCloseButtonPosition = function() { var right = zoomImage.get('actualWidth') - zoomImage.get('imageLeft') - zoomImage.get('imageWidth') + 10; var top = zoomImage.get('imageTop') + 10; if(right < 10) right = 10; if(top < 10) top = 10; closeButton.set('right', right); closeButton.set('top', top); }; var userInteractionStartFunction = function() { if(timeoutUserInteractionID){ clearTimeout(timeoutUserInteractionID); timeoutUserInteractionID = undefined; } else{ closeButton.set('visible', false); } }; var userInteractionEndFunction = function() { if(!closed){ timeoutUserInteractionID = setTimeout(userInteractionTimeoutFunction, 300); } }; var userInteractionTimeoutFunction = function() { timeoutUserInteractionID = undefined; closeButton.set('visible', true); setCloseButtonPosition(); }; this.MainViewer.set('toolTipEnabled', false); var veil = this.veilPopupPanorama; var zoomImage = this.zoomImagePopupPanorama; var closeButton = this.closeButtonPopupPanorama; if(closeButtonProperties){ for(var key in closeButtonProperties){ closeButton.set(key, closeButtonProperties[key]); } } var playersPaused = this.pauseCurrentPlayers(audio == null || !stopBackgroundAudio); if(audio){ if(stopBackgroundAudio){ this.pauseGlobalAudios(); } this.playGlobalAudio(audio); } var timeoutID = undefined; var timeoutUserInteractionID = undefined; zoomImage.bind('loaded', loadedFunction, this); setTimeout(function(){ self.bind('click', playerClickFunction, self, false); }, 0); zoomImage.set('image', image); zoomImage.set('customWidth', customWidth); zoomImage.set('customHeight', customHeight); zoomImage.set('showEffect', showEffect); zoomImage.set('hideEffect', hideEffect); zoomImage.set('visible', true); return zoomImage; },
  "getCurrentPlayerWithMedia": function(media){  var playerClass = undefined; var mediaPropertyName = undefined; switch(media.get('class')) { case 'Panorama': case 'LivePanorama': case 'HDRPanorama': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'panorama'; break; case 'Video360': playerClass = 'PanoramaPlayer'; mediaPropertyName = 'video'; break; case 'PhotoAlbum': playerClass = 'PhotoAlbumPlayer'; mediaPropertyName = 'photoAlbum'; break; case 'Map': playerClass = 'MapPlayer'; mediaPropertyName = 'map'; break; case 'Video': playerClass = 'VideoPlayer'; mediaPropertyName = 'video'; break; }; if(playerClass != undefined) { var players = this.getByClassName(playerClass); for(var i = 0; i<players.length; ++i){ var player = players[i]; if(player.get(mediaPropertyName) == media) { return player; } } } else { return undefined; } },
  "keepComponentVisibility": function(component, keep){  var key = 'keepVisibility_' + component.get('id'); var value = this.getKey(key); if(value == undefined && keep) { this.registerKey(key, keep); } else if(value != undefined && !keep) { this.unregisterKey(key); } },
  "setMainMediaByName": function(name){  var items = this.mainPlayList.get('items'); for(var i = 0; i<items.length; ++i){ var item = items[i]; if(item.get('media').get('label') == name) { this.mainPlayList.set('selectedIndex', i); return item; } } },
  "shareTwitter": function(url){  window.open('https://twitter.com/intent/tweet?source=webclient&url=' + url, '_blank'); },
  "getKey": function(key){  return window[key]; }
 },
 "verticalAlign": "top",
 "scrollBarOpacity": 0.5,
 "scrollBarMargin": 2,
 "contentOpaque": false,
 "height": "100%",
 "minHeight": 20,
 "gap": 10,
 "paddingTop": 0,
 "downloadEnabled": false,
 "shadow": false,
 "paddingBottom": 0,
 "borderRadius": 0,
 "minWidth": 20,
 "class": "Player",
 "data": {
  "name": "Player475"
 },
 "overflow": "visible",
 "definitions": [{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -179.72,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6A4A204B_7B0B_136F_41C1_A7B8832245F6"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -101.97,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6B534F54_7B0B_0D79_41D2_AF48C5EDBEE0"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -12.89,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6A3B103D_7B0B_132A_41B1_4CC5D17548DA"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -156.19,
   "backwardYaw": -28.15,
   "distance": 1,
   "panorama": "this.panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_582E0176_52F1_9424_41BA_C3003357DF6B",
 "thumbnailUrl": "media/panorama_582E0176_52F1_9424_41BA_C3003357DF6B_t.jpg",
 "label": "1792235565228_123183057331751718_6877668247949677281_f36c07b56b25ff504658b6c9f735bb31",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582E0176_52F1_9424_41BA_C3003357DF6B_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582E0176_52F1_9424_41BA_C3003357DF6B_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582E0176_52F1_9424_41BA_C3003357DF6B_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582E0176_52F1_9424_41BA_C3003357DF6B_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582E0176_52F1_9424_41BA_C3003357DF6B_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582E0176_52F1_9424_41BA_C3003357DF6B_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582E0176_52F1_9424_41BA_C3003357DF6B_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582E0176_52F1_9424_41BA_C3003357DF6B_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582E0176_52F1_9424_41BA_C3003357DF6B_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582E0176_52F1_9424_41BA_C3003357DF6B_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582E0176_52F1_9424_41BA_C3003357DF6B_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582E0176_52F1_9424_41BA_C3003357DF6B_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_582E0176_52F1_9424_41BA_C3003357DF6B_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_718A0430_6B8E_7FE3_41BC_264E9898DCFE"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -20.9,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_76E9AA1C_7B0B_36EA_41B1_64FC182D4FC4"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 78.03,
   "backwardYaw": -102.4,
   "distance": 1,
   "panorama": "this.panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -66.47,
   "backwardYaw": -150.8,
   "distance": 1,
   "panorama": "this.panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -2.53,
   "backwardYaw": 163.75,
   "distance": 1,
   "panorama": "this.panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200",
 "thumbnailUrl": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_t.jpg",
 "label": "5",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_44938019_5311_F3EC_41C1_00839DD38E45",
  "this.overlay_4907BA14_5310_97FB_41C3_C971B03338DF",
  "this.overlay_4AE38E70_5313_EC3C_41C8_D860C4AE53BB"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 102.51,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_750DE0CB_7B0B_136E_41DA_6C3754EABD82"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -77.49,
   "backwardYaw": 155.74,
   "distance": 1,
   "panorama": "this.panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F",
 "thumbnailUrl": "media/panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_t.jpg",
 "label": "7",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_49DC7510_5317_BDFC_41C2_E2788187E960"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_370142F7_3D76_A913_41BF_C1C74ADAC03A_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 23.81,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_76E95CC4_7B0B_3359_41D8_7227FC397392"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_58134031_52F1_B43C_41C6_897208B5BB0E_camera"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 5.36,
   "backwardYaw": 70.98,
   "distance": 1,
   "panorama": "this.panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -151.66,
   "backwardYaw": -23.41,
   "distance": 1,
   "panorama": "this.panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408",
 "thumbnailUrl": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_t.jpg",
 "label": "21",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_7A0C6AC9_5330_B46C_41C6_57B7BB573317",
  "this.overlay_798B0D93_5331_6CFC_416D_B3E0EAAAD910"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_5828C73D_52F1_7C24_41B2_772074CC709A_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 96.71,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6BCF0FE5_7B0B_0D5B_41D4_E7D0AEDD20AA"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -80.47,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_751CAD1D_7B0B_32EA_41C5_C46F318D5DA1"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -147.87,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_750C8A44_7B0B_3759_4167_1CD08C0DB8C4"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_69D7F613_5310_9FFC_41C6_DA5118062FEE",
 "thumbnailUrl": "media/panorama_69D7F613_5310_9FFC_41C6_DA5118062FEE_t.jpg",
 "label": "giengmatrong",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_69D7F613_5310_9FFC_41C6_DA5118062FEE_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_69D7F613_5310_9FFC_41C6_DA5118062FEE_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_69D7F613_5310_9FFC_41C6_DA5118062FEE_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_69D7F613_5310_9FFC_41C6_DA5118062FEE_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_69D7F613_5310_9FFC_41C6_DA5118062FEE_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_69D7F613_5310_9FFC_41C6_DA5118062FEE_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_69D7F613_5310_9FFC_41C6_DA5118062FEE_t.jpg"
  }
 ],
 "vfov": 151.56,
 "overlays": [
  "this.overlay_6859F7FF_5371_9C20_41C3_B250218E688E"
 ]
},
{
 "hfovMax": 130,
 "class": "Panorama",
 "hfovMin": "150%",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4_t.jpg"
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "dgtrcconglen",
 "id": "panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4",
 "thumbnailUrl": "media/panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4_t.jpg",
 "partial": false,
 "pitch": 0
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -81.09,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_749B5E87_7B0B_0FE7_41C1_997F33D2B9F9"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -171.62,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75183A51_7B0B_377A_41BA_E4D73BCA0501"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_5810090E_52F1_95E4_41D0_057739B73120_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 21.73,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6B41BF41_7B0B_0D5A_41D1_FDC37FFAD920"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 28.51,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_7553CD5D_7B0B_0D6B_41D2_9FF43A18B892"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_41B59243_52F1_745C_41D2_0F074F5B396F_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37B158A5_3D7A_9937_41A9_E252B459A742_camera"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_67858E59_6B82_0BA5_41D5_AC83F0585418",
 "thumbnailUrl": "media/panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_t.jpg",
 "label": "1792805137314_123183057331751718_6877668247949677281_1fc45b139b8e0a62316b7c8b9e61f1f6",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_t.jpg"
  }
 ],
 "vfov": 122.48,
 "overlays": [
  "this.overlay_72E25B46_6B8E_09AF_41D0_B1E1FC899608"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -173.82,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_7571FAA2_7B0B_37D9_41BE_23B4C228F457"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 13.8,
   "backwardYaw": -157.72,
   "distance": 1,
   "panorama": "this.panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_37BFC891_3D7B_79EF_41CC_225FF205D876"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB",
 "thumbnailUrl": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_t.jpg",
 "label": "17",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_7773FAD0_5331_947C_41A7_4A67F7D219FC",
  "this.overlay_7756713D_5330_F424_41D3_7837F884CE54",
  "this.overlay_7788527A_533F_942C_41D2_9F909C192AB9"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 154.84,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_76ED3CD0_7B0B_3379_41C8_069DD9682647"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -173.34,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_74E68C31_7B0B_333A_41B5_61275AF7F2A8"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -16.25,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_757DFD8D_7B0B_0DEB_41AF_2CA5A25544F2"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 95.71,
   "backwardYaw": -83.29,
   "distance": 1,
   "panorama": "this.panorama_37BDF644_3D7B_6976_41C0_850A6D00309F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -23.41,
   "backwardYaw": -151.66,
   "distance": 1,
   "panorama": "this.panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301",
 "thumbnailUrl": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_t.jpg",
 "label": "19",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_7504598F_5330_94E4_41D0_EA4EABF86FB7",
  "this.overlay_7BD5847B_5330_9C2C_41D1_3FB930DD1BE8"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 77.6,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_756B8D74_7B0B_0D3A_41C3_64EB49D7DC39"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 4.12,
   "backwardYaw": 158.12,
   "distance": 1,
   "panorama": "this.panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -150.8,
   "backwardYaw": -66.47,
   "distance": 1,
   "panorama": "this.panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1",
 "thumbnailUrl": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_t.jpg",
 "label": "4",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_4BBF4FCE_5317_6C64_41C5_C2118212FEE0",
  "this.overlay_4BFE04C3_5310_9C5D_418C_FA9A05611DC0"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -71.82,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75830AAE_7B0B_3726_41CD_4A395F4FEA76"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 21.07,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75444D4F_7B0B_0D67_41DB_01D4024841C3"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_58121349_52F1_F46C_41C1_961015C5B031_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 179.59,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_74C6BC0F_7B0B_32E7_41CA_7B84E09F3539"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -177.39,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_758B1D9C_7B0B_0DEA_41B2_203E4C0B8069"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -167.83,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75A73DB6_7B0B_0D39_41C7_99C0F4E1AC10"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -77.61,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6B92EF9D_7B0B_0DEB_41AF_943BEF57CF3F"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -173.54,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_74795E6F_7B0B_0F26_41D5_F172CE2DACF6"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -160.74,
   "backwardYaw": -20.84,
   "distance": 1,
   "panorama": "this.panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 113.68,
   "backwardYaw": -18.5,
   "distance": 1,
   "panorama": "this.panorama_37015C34_3D76_B916_41C4_D7B96DBCD969"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37B158A5_3D7A_9937_41A9_E252B459A742",
 "thumbnailUrl": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_t.jpg",
 "label": "2",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_45D332C8_5311_B46C_41CA_541CAB917B1C",
  "this.overlay_482BCDED_5310_AC24_41C9_4AC6CA24FE4C"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -178.61,
  "pitch": 0
 },
 "id": "camera_75DC0AF9_7B0B_372A_41D2_7F34A312CBEF"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -78.69,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6A5A0057_7B0B_1367_41C4_FF517603925E"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 0.28,
   "backwardYaw": 41.19,
   "distance": 1,
   "panorama": "this.panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8",
 "thumbnailUrl": "media/panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_t.jpg",
 "label": "1792235564279_123183057331751718_6877668247949677281_ca11bdc00faeb5ca4be8b12ab35a16de",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_17DE0DA6_5371_EC24_41BD_74BEBCA20DA2"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 138.1,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6BFEF00B_7B0B_12EF_41D1_8D6F07B2FB20"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -48.45,
   "backwardYaw": 76.56,
   "distance": 1,
   "panorama": "this.panorama_41B59243_52F1_745C_41D2_0F074F5B396F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 108.18,
   "backwardYaw": 15.82,
   "distance": 1,
   "panorama": "this.panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D",
 "thumbnailUrl": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_t.jpg",
 "label": "1792124354922_8402406252390010888_8402406252390010888_3b4b10e27ce89f32ee531e1f264ce307",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_7FA8B903_5310_95DC_41D1_333BA9273154",
  "this.overlay_7EA3FC9F_5311_ECE4_41C0_CE8748D70DE1"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 36.07,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_74235E26_7B0B_0ED9_41CF_C08E6573266B"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -158.93,
   "backwardYaw": -90.06,
   "distance": 1,
   "panorama": "this.panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4",
 "thumbnailUrl": "media/panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_t.jpg",
 "label": "1792235564776_123183057331751718_6877668247949677281_59996570d2caa38f7c4a65a3703f9e44",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_03488762_5310_BC5C_41D3_404982D3E7C6"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 76.16,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6B006C4B_7B0B_336E_4192_5CFA6690772F"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_camera"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 99.53,
   "backwardYaw": 100.1,
   "distance": 1,
   "panorama": "this.panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -107.87,
   "backwardYaw": 171.16,
   "distance": 1,
   "panorama": "this.panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_5828C73D_52F1_7C24_41B2_772074CC709A",
 "thumbnailUrl": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_t.jpg",
 "label": "1792235563840_123183057331751718_6877668247949677281_68a4063e41268f2b259f0988b49d4fdf",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_69D5E8C4_5371_B464_41BE_C12EF5EBEE3B",
  "this.overlay_686B61BB_5370_942C_41CE_9A9B8CD644BC"
 ]
},
{
 "hfovMax": 130,
 "class": "Panorama",
 "hfovMin": "150%",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5_t.jpg"
  }
 ],
 "vfov": 180,
 "hfov": 360,
 "label": "1792805137404_123183057331751718_6877668247949677281_d8459402a6de9420c777fc7d7fca7093",
 "id": "panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5",
 "thumbnailUrl": "media/panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5_t.jpg",
 "partial": false,
 "pitch": 0
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_camera"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 13.05,
   "backwardYaw": 6.46,
   "distance": 1,
   "panorama": "this.panorama_594DA097_52F7_94E4_41C5_224F3338F6CC"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 159.1,
   "backwardYaw": 86.34,
   "distance": 1,
   "panorama": "this.panorama_37BFC891_3D7B_79EF_41CC_225FF205D876"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060",
 "thumbnailUrl": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_t.jpg",
 "label": "15",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_71D7670B_5333_9DEC_41C5_1D5B60532171",
  "this.overlay_70CA303D_5333_B424_41C9_02E92928397D"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 50.52,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6B26DF1D_7B0B_0EEB_41D6_7E168BAD88A4"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 167.11,
   "backwardYaw": 142.91,
   "distance": 1,
   "panorama": "this.panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 10.71,
   "backwardYaw": -98.28,
   "distance": 1,
   "panorama": "this.panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C",
 "thumbnailUrl": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_t.jpg",
 "label": "1792235564140_123183057331751718_6877668247949677281_b592c37052c77805bedde1413d4a1612",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_13C8AD8F_537F_ECE4_41D2_3D4E28F1851E",
  "this.overlay_1181FBA2_5370_94DC_41C8_55EF5B202D9E"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -11.1,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_74F06C3E_7B0B_3326_41D2_F02150D1202C"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 6.18,
   "backwardYaw": -161.37,
   "distance": 1,
   "panorama": "this.panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 70.98,
   "backwardYaw": 5.36,
   "distance": 1,
   "panorama": "this.panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA",
 "thumbnailUrl": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_t.jpg",
 "label": "22",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_79946F23_532F_EDDC_41AD_13472CCB51CA",
  "this.overlay_795994A7_532F_BC24_41C3_848612638BDF"
 ]
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -115.39,
   "backwardYaw": -103.84,
   "distance": 1,
   "panorama": "this.panorama_5813582E_52F1_B424_41D1_D69A96FEC19E"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -10.02,
   "backwardYaw": 104.46,
   "distance": 1,
   "panorama": "this.panorama_5816F016_52F1_93E4_41C3_D978FA13AD04"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8",
 "thumbnailUrl": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_t.jpg",
 "label": "1792235564573_123183057331751718_6877668247949677281_c0b8e353655857008b65b782e7bf6a09",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_1AFFF51E_5370_BDE4_41A5_D5C582FA3D92",
  "this.overlay_1EECB4C8_536F_FC6C_41C1_700AD2DF09F2"
 ]
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -1.44,
   "backwardYaw": 171.12,
   "distance": 1,
   "panorama": "this.panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -28.15,
   "backwardYaw": -156.19,
   "distance": 1,
   "panorama": "this.panorama_582E0176_52F1_9424_41BA_C3003357DF6B"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -153.99,
   "backwardYaw": -25.16,
   "distance": 1,
   "panorama": "this.panorama_5816F016_52F1_93E4_41C3_D978FA13AD04"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9",
 "thumbnailUrl": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_t.jpg",
 "label": "1792235565102_123183057331751718_6877668247949677281_d68ad4ce39e64ae24c931f914a137f47",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_05DBF2A2_53F3_74DF_41D4_B8CE235CACB1",
  "this.overlay_099DB5A4_53F1_FC24_41D4_7EAB7D106D83",
  "this.overlay_090345DA_53FF_BC6C_41BC_0EEB8BB618A5"
 ]
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 57.79,
   "backwardYaw": -102.69,
   "distance": 1,
   "panorama": "this.panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 9.34,
   "backwardYaw": 122.89,
   "distance": 1,
   "panorama": "this.panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 83.75,
   "backwardYaw": 3.14,
   "distance": 1,
   "panorama": "this.panorama_37015C34_3D76_B916_41C4_D7B96DBCD969"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_41B17B3C_52F0_9424_41A1_390023C55BE4",
 "thumbnailUrl": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_t.jpg",
 "label": "1792124354851_8402406252390010888_8402406252390010888_0db462a403a95096ac34a3bb4a6b04b9",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_7C1FA4C0_5313_BC5C_41B7_E717CB2EB2CC",
  "this.overlay_62D3050C_5310_9DE4_41C7_0AEFF03A2DA5",
  "this.overlay_62A228B8_5311_F42C_419A_6B4AD98FBBDF",
  "this.overlay_7507584F_6BBE_17BD_41D0_9E9102B8194E"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 156.59,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75DB5DE8_7B0B_0D29_41C4_501A9FB1799E"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_69D7F613_5310_9FFC_41C6_DA5118062FEE"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -152.23,
   "backwardYaw": 65.1,
   "distance": 1,
   "panorama": "this.panorama_37BF345B_3D7B_A913_418C_0BA72EB00126"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026",
 "thumbnailUrl": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_t.jpg",
 "label": "1792124354549_8402406252390010888_8402406252390010888_5b26df70171f12be3f1f7d1127fd9b0b",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_6556731B_5311_F5EC_41C0_5959A7757442",
  "this.overlay_69864EC9_536F_EC6C_41D3_8FD2542D7C2A"
 ]
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 32.13,
   "backwardYaw": -41.9,
   "distance": 1,
   "panorama": "this.panorama_370142F7_3D76_A913_41BF_C1C74ADAC03A"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 143.8,
   "backwardYaw": -53.64,
   "distance": 1,
   "panorama": "this.panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8",
 "thumbnailUrl": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_t.jpg",
 "label": "12",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_4D614679_532F_9C2C_41B8_D528C3C19A17",
  "this.overlay_4D65473C_5330_FC2B_41BC_61F8097C41F9"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -36.2,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_74AB2E93_7B0B_0FFF_4174_B77A2BFB1123"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 159.16,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_74957BDA_7B0B_3569_41D7_4C2548E0418D"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -161.91,
   "backwardYaw": 39.95,
   "distance": 1,
   "panorama": "this.panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 100.1,
   "backwardYaw": 99.53,
   "distance": 1,
   "panorama": "this.panorama_5828C73D_52F1_7C24_41B2_772074CC709A"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 9.82,
   "backwardYaw": 159.23,
   "distance": 1,
   "panorama": "this.panorama_58134031_52F1_B43C_41C6_897208B5BB0E"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543",
 "thumbnailUrl": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_t.jpg",
 "label": "13",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_4DB4B390_5330_94FC_41D0_4B476B23A428",
  "this.overlay_4DCDB712_5330_FDFC_41D2_F6E7422D4EC3",
  "this.overlay_4DD083D2_5330_947F_41D1_C4B4B89D46A0"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -154.67,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_746F7E62_7B0B_0F5E_419D_1A7F967D9B8E"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 177.47,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6A759073_7B0B_133F_41C3_D6FA0BF88204"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 89.94,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_74109E19_7B0B_0EEB_41CC_8BAC9ADB78BF"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -9.78,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_751160D7_7B0B_1367_41B4_C60E28A39DF2"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -143.93,
   "backwardYaw": 170.22,
   "distance": 1,
   "panorama": "this.panorama_58121349_52F1_F46C_41C1_961015C5B031"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3",
 "thumbnailUrl": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_t.jpg",
 "label": "1792235565032_123183057331751718_6877668247949677281_dbc100e7b4dd7af98fb1bf77f248b5f5",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_05E85800_53F7_F3DC_41D3_17DC1317AB28",
  "this.overlay_053F76A8_53F0_BC2C_41C0_ABD2F9DC7E8F"
 ]
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 170.22,
   "backwardYaw": -143.93,
   "distance": 1,
   "panorama": "this.panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 1.38,
   "backwardYaw": -95.95,
   "distance": 1,
   "panorama": "this.panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_58121349_52F1_F46C_41C1_961015C5B031",
 "thumbnailUrl": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_t.jpg",
 "label": "1792235564968_123183057331751718_6877668247949677281_97c0b98172bd539f2022807a800e2c4f",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_01B529EF_53F3_9424_41D4_1BF97ECDCB18",
  "this.overlay_06E16EF5_53F1_6C24_41CD_B60BACBBC9F0"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -140.05,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75119D10_7B0B_32FA_41CE_65B306EE86E7"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 2.61,
   "backwardYaw": -38.58,
   "distance": 1,
   "panorama": "this.panorama_37BF345B_3D7B_A913_418C_0BA72EB00126"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -102.69,
   "backwardYaw": 57.79,
   "distance": 1,
   "panorama": "this.panorama_41B17B3C_52F0_9424_41A1_390023C55BE4"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28",
 "thumbnailUrl": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_t.jpg",
 "label": "1792124354670_8402406252390010888_8402406252390010888_f3adc8eb6cbf1adb1e4c528f77fdc56b",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_6142D722_531F_9DDC_41CE_FBD400BA2830",
  "this.overlay_60F4E67D_5310_9C25_41C7_23BFD3ABBD07"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 167.21,
  "pitch": 0
 },
 "id": "camera_7561FA93_7B0B_37FE_41D0_312F9508AEA9"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -98.73,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6A6A0064_7B0B_135A_41D1_E8DA021D5FE5"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -95.95,
   "backwardYaw": 1.38,
   "distance": 1,
   "panorama": "this.panorama_58121349_52F1_F46C_41C1_961015C5B031"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 108.38,
   "backwardYaw": 3.64,
   "distance": 1,
   "panorama": "this.panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF",
 "thumbnailUrl": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_t.jpg",
 "label": "1792235564905_123183057331751718_6877668247949677281_2ba452a40d6770a50558e9ca88271d1b",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_02A91049_53F1_946C_41C2_08E802E6BF95",
  "this.overlay_012B2C04_53F0_B3DB_41D1_D07AC930C1CA"
 ]
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -98.28,
   "backwardYaw": 10.71,
   "distance": 1,
   "panorama": "this.panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 102.39,
   "backwardYaw": 6.66,
   "distance": 1,
   "panorama": "this.panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F",
 "thumbnailUrl": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_t.jpg",
 "label": "1792235564072_123183057331751718_6877668247949677281_a7831f9f8ab268991cfbd38bf9a9fbad",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_6C104CB5_5370_AC24_41CC_F0434F1FEBD5",
  "this.overlay_135F8526_5370_9C24_41CA_4EDDE0D52BA0"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -37.09,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75F61E00_7B0B_0ED9_41DE_162F80C85A25"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -166.2,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75303D37_7B0B_0D27_41C0_B5E7D9CD2DA2"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 161.5,
  "pitch": 0
 },
 "id": "camera_74A74BEC_7B0B_352A_41BC_DDFB1606BA73"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 126.36,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6A084018_7B0B_12E9_41AF_6450D6D738C3"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 29.2,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_7571DD81_7B0B_0DDB_41C9_3C12A6698DAD"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 72.13,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6B9DAFAF_7B0B_0D27_41DB_A1C84E9E61C6"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 178.56,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_755FED69_7B0B_0D2B_41DD_21F3436A7635"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -170.18,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6B163F0B_7B0B_0EEE_41D8_69182548B016"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -18.38,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75930ABB_7B0B_372E_41DA_D5D078780CAD"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -75.8,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75E49DF4_7B0B_0D3A_41D8_F8C17DFE4ABD"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 76.64,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_7502EA37_7B0B_3726_41DE_142FA827C2D7"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 32.97,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6B062EF9_7B0B_0F2A_41C8_2EBC542B6E4C"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 158.12,
   "backwardYaw": 4.12,
   "distance": 1,
   "panorama": "this.panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -20.84,
   "backwardYaw": -160.74,
   "distance": 1,
   "panorama": "this.panorama_37B158A5_3D7A_9937_41A9_E252B459A742"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52",
 "thumbnailUrl": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_t.jpg",
 "label": "3",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_450BA067_5313_B425_41D0_E9B9AEBE596E",
  "this.overlay_44DF5F4E_5310_AC64_41D0_19EBD5274A30"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_camera"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 122.89,
   "backwardYaw": 9.34,
   "distance": 1,
   "panorama": "this.panorama_41B17B3C_52F0_9424_41A1_390023C55BE4"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968",
 "thumbnailUrl": "media/panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_t.jpg",
 "label": "1792124354729_8402406252390010888_8402406252390010888_44466009d28525096b7f69596c138f8d",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_62DE2D55_5310_EC64_41BF_66633B8B0843"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 18.63,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6B72FF77_7B0B_0D26_41D3_23870D5CC40D"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_camera"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 5.63,
   "backwardYaw": 161.62,
   "distance": 1,
   "panorama": "this.panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -70.11,
   "backwardYaw": -38.96,
   "distance": 1,
   "panorama": "this.panorama_5816F016_52F1_93E4_41C3_D978FA13AD04"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244",
 "thumbnailUrl": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_t.jpg",
 "label": "1792806114516_123183057331751718_6877668247949677281_db9e00ef5ddb6c27aa876eac9d055141",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_7D0BFDC1_6B82_08A5_41D6_8A66C21AD201",
  "this.overlay_7D7EA2C5_6B83_F8AD_4191_AE7793EB9835",
  "this.overlay_73E5ED80_6B82_08A3_41D1_7D783506196A"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -114.9,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_751B60E4_7B0B_135A_41D0_3DE0AD81B70D"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -24.26,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75B2CAD5_7B0B_377B_41D5_A7A37D953919"
},
{
 "class": "PlayList",
 "items": [
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 0, 1)",
   "media": "this.panorama_37015C34_3D76_B916_41C4_D7B96DBCD969",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37B158A5_3D7A_9937_41A9_E252B459A742_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 1, 2)",
   "media": "this.panorama_37B158A5_3D7A_9937_41A9_E252B459A742",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 2, 3)",
   "media": "this.panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 3, 4)",
   "media": "this.panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 4, 5)",
   "media": "this.panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 5, 6)",
   "media": "this.panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 6, 7)",
   "media": "this.panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 7, 8)",
   "media": "this.panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 8, 9)",
   "media": "this.panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 9, 10)",
   "media": "this.panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 10, 11)",
   "media": "this.panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 11, 12)",
   "media": "this.panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_370142F7_3D76_A913_41BF_C1C74ADAC03A_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 12, 13)",
   "media": "this.panorama_370142F7_3D76_A913_41BF_C1C74ADAC03A",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 13, 14)",
   "media": "this.panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_58134031_52F1_B43C_41C6_897208B5BB0E_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 14, 15)",
   "media": "this.panorama_58134031_52F1_B43C_41C6_897208B5BB0E",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 15, 16)",
   "media": "this.panorama_594DA097_52F7_94E4_41C5_224F3338F6CC",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 16, 17)",
   "media": "this.panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 17, 18)",
   "media": "this.panorama_37BFC891_3D7B_79EF_41CC_225FF205D876",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 18, 19)",
   "media": "this.panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 19, 20)",
   "media": "this.panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 20, 21)",
   "media": "this.panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 21, 22)",
   "media": "this.panorama_37BDF644_3D7B_6976_41C0_850A6D00309F",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 22, 23)",
   "media": "this.panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 23, 24)",
   "media": "this.panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 24, 25)",
   "media": "this.panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 25, 26)",
   "media": "this.panorama_37BF345B_3D7B_A913_418C_0BA72EB00126",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 26, 27)",
   "media": "this.panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_5828C73D_52F1_7C24_41B2_772074CC709A_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 27, 28)",
   "media": "this.panorama_5828C73D_52F1_7C24_41B2_772074CC709A",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 28, 29)",
   "media": "this.panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 29, 30)",
   "media": "this.panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 30, 31)",
   "media": "this.panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 31, 32)",
   "media": "this.panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 32, 33)",
   "media": "this.panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 33, 34)",
   "media": "this.panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 34, 35)",
   "media": "this.panorama_582FA100_52F1_B5DC_41C4_9454C21B9532",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 35, 36)",
   "media": "this.panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 36, 37)",
   "media": "this.panorama_5813582E_52F1_B424_41D1_D69A96FEC19E",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 37, 38)",
   "media": "this.panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 38, 39)",
   "media": "this.panorama_5816F016_52F1_93E4_41C3_D978FA13AD04",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 39, 40)",
   "media": "this.panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 40, 41)",
   "media": "this.panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 41, 42)",
   "media": "this.panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 42, 43)",
   "media": "this.panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_58121349_52F1_F46C_41C1_961015C5B031_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 43, 44)",
   "media": "this.panorama_58121349_52F1_F46C_41C1_961015C5B031",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 44, 45)",
   "media": "this.panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 45, 46)",
   "media": "this.panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 46, 47)",
   "media": "this.panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_582E0176_52F1_9424_41BA_C3003357DF6B_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 47, 48)",
   "media": "this.panorama_582E0176_52F1_9424_41BA_C3003357DF6B",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_5810090E_52F1_95E4_41D0_057739B73120_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 48, 49)",
   "media": "this.panorama_5810090E_52F1_95E4_41D0_057739B73120",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 49, 50)",
   "media": "this.panorama_58121CAB_52F1_AC2C_41D1_E41322973BD4",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 50, 51)",
   "media": "this.panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 51, 52)",
   "media": "this.panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 52, 53)",
   "media": "this.panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 53, 54)",
   "media": "this.panorama_41B17B3C_52F0_9424_41A1_390023C55BE4",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 54, 55)",
   "media": "this.panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_41B59243_52F1_745C_41D2_0F074F5B396F_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 55, 56)",
   "media": "this.panorama_41B59243_52F1_745C_41D2_0F074F5B396F",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_69D7F613_5310_9FFC_41C6_DA5118062FEE_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 56, 57)",
   "media": "this.panorama_69D7F613_5310_9FFC_41C6_DA5118062FEE",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 57, 58)",
   "media": "this.panorama_67858E59_6B82_0BA5_41D5_AC83F0585418",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "camera": "this.panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 58, 59)",
   "media": "this.panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5",
   "player": "this.MainViewerPanoramaPlayer"
  },
  {
   "class": "PanoramaPlayListItem",
   "end": "this.trigger('tourEnded')",
   "camera": "this.panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_camera",
   "begin": "this.setEndToItemIndex(this.mainPlayList, 59, 0)",
   "media": "this.panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244",
   "player": "this.MainViewerPanoramaPlayer"
  }
 ],
 "id": "mainPlayList"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 141.42,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75EF0B07_7B0B_36E7_41D1_3847E1B0800C"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 152.69,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6A19B024_7B0B_12D9_41DB_AA74C027F936"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -122.21,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75FFCB13_7B0B_36FF_41DD_0B9C2AFD2030"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -83.29,
   "backwardYaw": 95.71,
   "distance": 1,
   "panorama": "this.panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 168.9,
   "backwardYaw": -42.72,
   "distance": 1,
   "panorama": "this.panorama_5810090E_52F1_95E4_41D0_057739B73120"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 63.31,
   "backwardYaw": 1.39,
   "distance": 1,
   "panorama": "this.panorama_37015C34_3D76_B916_41C4_D7B96DBCD969"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37BDF644_3D7B_6976_41C0_850A6D00309F",
 "thumbnailUrl": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_t.jpg",
 "label": "20",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_75498522_5331_9DDF_41D3_CCB29D6AA4F3",
  "this.overlay_740AF0A1_5330_B4DD_41A9_39CEC62B003D",
  "this.overlay_75824498_6B82_18A3_41D2_EAD19ADFA709"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_600FE73A_6B82_39E7_41D6_3827DCA94BB5_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_camera"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 62.34,
   "backwardYaw": -12.79,
   "distance": 1,
   "panorama": "this.panorama_37015C34_3D76_B916_41C4_D7B96DBCD969"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -161.37,
   "backwardYaw": 6.18,
   "distance": 1,
   "panorama": "this.panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_41B17B3C_52F0_9424_41A1_390023C55BE4"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 15.82,
   "backwardYaw": 108.18,
   "distance": 1,
   "panorama": "this.panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2",
 "thumbnailUrl": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_t.jpg",
 "label": "23",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_789E4193_5310_F4FC_41D0_3CC17FC0330E",
  "this.overlay_7D70493F_5317_9424_41AF_1D2787E83538",
  "this.overlay_621196D6_5310_9C64_41CF_6B4F9F93A5F3",
  "this.overlay_75C99D11_6BBE_09A2_41D8_40B2C1F42085"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -174.37,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_753EAD43_7B0B_0D5E_41DD_2B63A0DBC2B9"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -119.39,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_76F71CDC_7B0B_336A_41DA_9A3AC5A3809F"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -178.62,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75024CF7_7B0B_3326_41D0_0C108900401E"
},
{
 "class": "PanoramaPlayer",
 "viewerArea": "this.MainViewer",
 "displayPlaybackBar": true,
 "touchControlMode": "drag_rotation",
 "id": "MainViewerPanoramaPlayer",
 "gyroscopeVerticalDraggingEnabled": true,
 "mouseControlMode": "drag_acceleration"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -175.88,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_74E48ED7_7B0B_0F67_41BB_4ABDBB17859D"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 137.28,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75CC7AED_7B0B_372A_41C0_C249409A83C4"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 161.62,
   "backwardYaw": 5.63,
   "distance": 1,
   "panorama": "this.panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -90.06,
   "backwardYaw": -158.93,
   "distance": 1,
   "panorama": "this.panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -27.31,
   "backwardYaw": -151.49,
   "distance": 1,
   "panorama": "this.panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2",
 "thumbnailUrl": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_t.jpg",
 "label": "1792235564711_123183057331751718_6877668247949677281_f4c1fd06b900ed53a1ba47c42ccf32e8",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_03F3CEAE_5310_AC24_4170_3416F4FC33A5",
  "this.overlay_1D8C6C18_5311_93EC_41B5_6827E6B14AF9",
  "this.overlay_4AF490E4_6B82_1863_41D9_24ACCA9BDB52"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_camera"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -0.41,
   "backwardYaw": -147.03,
   "distance": 1,
   "panorama": "this.panorama_594DA097_52F7_94E4_41C5_224F3338F6CC"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 159.23,
   "backwardYaw": 9.82,
   "distance": 1,
   "panorama": "this.panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 25.33,
   "backwardYaw": -129.48,
   "distance": 1,
   "panorama": "this.panorama_5816F016_52F1_93E4_41C3_D978FA13AD04"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_58134031_52F1_B43C_41C6_897208B5BB0E",
 "thumbnailUrl": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_t.jpg",
 "label": "trc cong den",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_73F250F2_5330_B43C_41C4_6F1631C7BFB6",
  "this.overlay_73B00EA9_5337_EC2C_41C7_E15E0C82775C",
  "this.overlay_72E600FC_5330_9424_41BF_6E1C61F3CAD4"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 22.28,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_742EBB4E_7B0B_3569_41DB_03E7BA7F8DA5"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -117.66,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_752A1A5E_7B0B_3766_4199_C722E2C72613"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 77.31,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_7439AB66_7B0B_3559_41C7_F077E1D2424A"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 98.04,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_76F8DCE9_7B0B_332B_41BB_A5A16B61F0BC"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 131.55,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_740EEB2A_7B0B_352E_41B2_7AE02A85BC36"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -116.69,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75471A78_7B0B_372A_4193_BE46CBD9B2A6"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -57.11,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_74499B77_7B0B_3526_41DC_568E85028B5C"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 86.34,
   "backwardYaw": 159.1,
   "distance": 1,
   "panorama": "this.panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37BFC891_3D7B_79EF_41CC_225FF205D876",
 "thumbnailUrl": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_t.jpg",
 "label": "16",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_70A10999_5330_F4EC_4188_8472B4DF7754",
  "this.overlay_70538411_5330_93FC_41BA_58465835C5C3"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 27.77,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75956DA9_7B0B_0D2A_41CE_2D1A25168BA6"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -21.88,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_747BDBB1_7B0B_353B_41DB_2A4EE1CD9332"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 6.46,
   "backwardYaw": 13.05,
   "distance": 1,
   "panorama": "this.panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -147.03,
   "backwardYaw": -0.41,
   "distance": 1,
   "panorama": "this.panorama_58134031_52F1_B43C_41C6_897208B5BB0E"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_594DA097_52F7_94E4_41C5_224F3338F6CC",
 "thumbnailUrl": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_t.jpg",
 "label": "1792124355651_8402406252390010888_8402406252390010888_9c99e8cfe55361a1bfe6302d4ad2f90d",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_72AAA66E_5331_FC24_41D1_88663E4F0231",
  "this.overlay_704BB634_5331_9C3B_41A8_BD3F9249E154"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -164.18,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75BD0DCF_7B0B_0D66_41CB_563E42237D0A"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -157.72,
   "backwardYaw": 13.8,
   "distance": 1,
   "panorama": "this.panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31",
 "thumbnailUrl": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_t.jpg",
 "label": "18",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_77CE0F9B_5330_ACED_41C9_02802FB29B87",
  "this.overlay_751D6E5E_5330_AC64_41C4_8315BCD0FEC5",
  "this.overlay_760721AF_5331_9425_41D1_9406F22B71B5"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -20.77,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75253D2B_7B0B_0D2F_41DA_E5429753D1EE"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 113.53,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_748AABC8_7B0B_3569_41DA_2F3642256749"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -12.79,
   "backwardYaw": 62.34,
   "distance": 1,
   "panorama": "this.panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 3.14,
   "backwardYaw": 83.75,
   "distance": 1,
   "panorama": "this.panorama_41B17B3C_52F0_9424_41A1_390023C55BE4"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_69D7F613_5310_9FFC_41C6_DA5118062FEE"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 1.39,
   "backwardYaw": 63.31,
   "distance": 1,
   "panorama": "this.panorama_37BDF644_3D7B_6976_41C0_850A6D00309F"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_582FA100_52F1_B5DC_41C4_9454C21B9532"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -18.5,
   "backwardYaw": 113.68,
   "distance": 1,
   "panorama": "this.panorama_37B158A5_3D7A_9937_41A9_E252B459A742"
  }
 ],
 "hfov": 90,
 "partial": true,
 "id": "panorama_37015C34_3D76_B916_41C4_D7B96DBCD969",
 "thumbnailUrl": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_t.jpg",
 "label": "blobid4-1679281823",
 "pitch": 0,
 "hfovMax": 90,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "height": 1536
     },
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_0/f/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_t.jpg",
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 3,
      "tags": "ondemand",
      "colCount": 3,
      "width": 1536,
      "height": 1536
     },
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_0/r/2/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   }
  }
 ],
 "vfov": 46.68,
 "overlays": [
  "this.overlay_5CF9F322_52F3_F5DC_417F_CDCF5D51ECFD",
  "this.overlay_5C874AEF_52F3_7425_41D3_9F75D9D6C2E8",
  "this.overlay_5CFBC4FB_52F0_9C2C_41C7_893041E79E69",
  "this.overlay_42637E71_52F0_AC3C_41C4_DFAD03997E37",
  "this.overlay_4261C9A2_52F1_B4DC_41C3_D9B250598411",
  "this.overlay_400313E9_52F7_F42C_41B9_594A53EB2E40",
  "this.overlay_691FC70E_5373_9DE7_41CF_C9B290F4EA9F",
  "this.overlay_7147082E_6B82_17FF_41CA_4D5CBC6DF2DD",
  "this.overlay_77F178E7_6B86_086E_41C5_2119DBD561E0"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -92.35,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_76F4AA2A_7B0B_372E_41BA_310FBE0E7073"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 26.01,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_7442BE3D_7B0B_0F2A_41D9_CFEDC590C950"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_582E0176_52F1_9424_41BA_C3003357DF6B_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 101.45,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6BAC4FC0_7B0B_0D5A_41D7_6F9BFF7A7F1B"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 6.66,
   "backwardYaw": 102.39,
   "distance": 1,
   "panorama": "this.panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 171.16,
   "backwardYaw": -107.87,
   "distance": 1,
   "panorama": "this.panorama_5828C73D_52F1_7C24_41B2_772074CC709A"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 104.2,
   "backwardYaw": -78.55,
   "distance": 1,
   "panorama": "this.panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_58134031_52F1_B43C_41C6_897208B5BB0E"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E",
 "thumbnailUrl": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_t.jpg",
 "label": "1792235564000_123183057331751718_6877668247949677281_b83768c99838b9e9180bc5ebe549fe64",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_6EE4214E_5377_7462_419D_4C830F9CF434",
  "this.overlay_6C9BF1FB_5371_742C_41B0_976A0933004C",
  "this.overlay_6C6D9DD0_5371_AC7C_41BE_DE2BE7CAB620",
  "this.overlay_6D6ECA7D_5370_9424_41C2_31FFF975020D"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -176.86,
  "pitch": 0
 },
 "id": "camera_745BDB89_7B0B_35EA_41CF_21500749BE02"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -138.81,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_746B3B9F_7B0B_35E7_41CA_F26DBBD4C5CF"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "id": "panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 81.72,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_7406BE0C_7B0B_0EE9_41C7_A9EC35417688"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 2.2,
   "backwardYaw": 8.38,
   "distance": 1,
   "panorama": "this.panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820",
 "thumbnailUrl": "media/panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_t.jpg",
 "label": "10",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_4F713858_5310_F46B_41D3_B9EFD9EE39E8"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 18.09,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_74B56EA3_7B0B_0FDF_419E_B8BD669339A9"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 109.89,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_744C9E4A_7B0B_0F69_41DB_2C78F6A1F65F"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_camera"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 81.27,
   "backwardYaw": 12.17,
   "distance": 1,
   "panorama": "this.panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8",
 "thumbnailUrl": "media/panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_t.jpg",
 "label": "8",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_49CB1FC6_5310_EC64_41BC_AB66EB429656"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -177.8,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6B31AF2F_7B0B_0D27_4187_B35CB13A95CC"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -25.16,
   "backwardYaw": -153.99,
   "distance": 1,
   "panorama": "this.panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -38.96,
   "backwardYaw": -70.11,
   "distance": 1,
   "panorama": "this.panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 104.46,
   "backwardYaw": -10.02,
   "distance": 1,
   "panorama": "this.panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -129.48,
   "backwardYaw": 25.33,
   "distance": 1,
   "panorama": "this.panorama_58134031_52F1_B43C_41C6_897208B5BB0E"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_5816F016_52F1_93E4_41C3_D978FA13AD04",
 "thumbnailUrl": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_t.jpg",
 "label": "1792235564644_123183057331751718_6877668247949677281_a07acaac2a2ec707699392d494c2d584",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_036FDE21_5310_EFDC_41D0_5C0EF79FFC40",
  "this.overlay_1C732C26_5310_EC24_41A0_D5647CABE91C",
  "this.overlay_1EDD4A15_5313_B7E4_41D2_F5AE3103D8A6",
  "this.overlay_0F912236_53F1_7424_41B4_61DA6C7DFCE0"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -96.25,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75349A6B_7B0B_372F_41A1_E64E2CD39F24"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -176.36,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_750A3D04_7B0B_32DA_4196_8E0495EDF77A"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -166.95,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_74B73BFD_7B0B_352A_41D8_E4C117B5FCE5"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 12.17,
   "backwardYaw": 81.27,
   "distance": 1,
   "panorama": "this.panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 163.75,
   "backwardYaw": -2.53,
   "distance": 1,
   "panorama": "this.panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 155.74,
   "backwardYaw": -77.49,
   "distance": 1,
   "panorama": "this.panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE",
 "thumbnailUrl": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_t.jpg",
 "label": "6",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_4B95915E_5310_B464_41CC_322FF500A125",
  "this.overlay_49039C0F_5310_93E4_41A6_130972224591",
  "this.overlay_4860B7D4_531F_9C64_41C8_E50865EA87D1"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -75.54,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6B13EC57_7B0B_3367_41D3_50BDBBE1E0F6"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -170.66,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6B633F64_7B0B_0D5A_41C8_BB5FFB3FB4C1"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_camera"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -41.9,
   "backwardYaw": 32.13,
   "distance": 1,
   "panorama": "this.panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_370142F7_3D76_A913_41BF_C1C74ADAC03A",
 "thumbnailUrl": "media/panorama_370142F7_3D76_A913_41BF_C1C74ADAC03A_t.jpg",
 "label": "1615381631_972_Ngam-di-tich-lich-su-Den-Hung-qua-anh-360",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_370142F7_3D76_A913_41BF_C1C74ADAC03A_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_370142F7_3D76_A913_41BF_C1C74ADAC03A_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_370142F7_3D76_A913_41BF_C1C74ADAC03A_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_370142F7_3D76_A913_41BF_C1C74ADAC03A_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_370142F7_3D76_A913_41BF_C1C74ADAC03A_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_370142F7_3D76_A913_41BF_C1C74ADAC03A_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_370142F7_3D76_A913_41BF_C1C74ADAC03A_t.jpg"
  }
 ],
 "vfov": 151.56,
 "overlays": [
  "this.overlay_4D103EEE_5331_EC24_419A_08EC5B8063B5"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 19.26,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_74C5CEB0_7B0B_0F39_41D8_AB2FBC67BB2F"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 19.26,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_74F49EE8_7B0B_0F2A_4199_64626F6A5A38"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 141.04,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75A2CAC8_7B0B_3769_41BF_E5E270889688"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -58.78,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6BBF0FD2_7B0B_0D79_41B3_A9BEAEF1DEB4"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -78.55,
   "backwardYaw": 104.2,
   "distance": 1,
   "panorama": "this.panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E",
 "thumbnailUrl": "media/panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_t.jpg",
 "label": "1792235563926_123183057331751718_6877668247949677281_076598ac9f52c2d9942844b2b4b9eb53",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_6C9A74C2_5371_9C5C_41B0_393C518DD355"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -71.62,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6A2B1031_7B0B_133B_41D0_1F24413E6030"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -84.29,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75C2CAE0_7B0B_375A_41CB_46F62F344E02"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 87.65,
   "backwardYaw": -48.45,
   "distance": 1,
   "panorama": "this.panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -103.84,
   "backwardYaw": -115.39,
   "distance": 1,
   "panorama": "this.panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_5813582E_52F1_B424_41D1_D69A96FEC19E",
 "thumbnailUrl": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_t.jpg",
 "label": "1792235564496_123183057331751718_6877668247949677281_3642b13ed68ae0754feff2130ab010a3",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_1AC888E4_5371_7424_41D4_99DCB19E4ADA",
  "this.overlay_1AC7C23E_5373_9424_416B_3123BA8F2FD1"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -103.44,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75B0ADC2_7B0B_0D5E_41CB_942C129FB034"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -174.64,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6B82CF89_7B0B_0DEA_41DC_39AD975C8B46"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_camera"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 76.56,
   "backwardYaw": -48.45,
   "distance": 1,
   "panorama": "this.panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_41B59243_52F1_745C_41D2_0F074F5B396F",
 "thumbnailUrl": "media/panorama_41B59243_52F1_745C_41D2_0F074F5B396F_t.jpg",
 "label": "1792124354986_8402406252390010888_8402406252390010888_df44c680e655712e91c74f16602a47e1",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B59243_52F1_745C_41D2_0F074F5B396F_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B59243_52F1_745C_41D2_0F074F5B396F_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B59243_52F1_745C_41D2_0F074F5B396F_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B59243_52F1_745C_41D2_0F074F5B396F_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B59243_52F1_745C_41D2_0F074F5B396F_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B59243_52F1_745C_41D2_0F074F5B396F_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B59243_52F1_745C_41D2_0F074F5B396F_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B59243_52F1_745C_41D2_0F074F5B396F_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B59243_52F1_745C_41D2_0F074F5B396F_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B59243_52F1_745C_41D2_0F074F5B396F_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B59243_52F1_745C_41D2_0F074F5B396F_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_41B59243_52F1_745C_41D2_0F074F5B396F_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_41B59243_52F1_745C_41D2_0F074F5B396F_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_64059F0F_6B82_09BD_41C5_9839B8EBA5AE"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 131.55,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6BEEEFFE_7B0B_0D29_41C2_B2DEBC62C90E"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 84.05,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_7432FE31_7B0B_0F3A_41D2_80FD2E542F21"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -66.32,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_7557EA86_7B0B_37D9_41DA_E776F212A6B1"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -93.66,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_74893E7B_7B0B_0F2E_41CB_4EE25A0E8772"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 8.38,
   "backwardYaw": 2.2,
   "distance": 1,
   "panorama": "this.panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 98.91,
   "backwardYaw": -158.27,
   "distance": 1,
   "panorama": "this.panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -102.4,
   "backwardYaw": 78.03,
   "distance": 1,
   "panorama": "this.panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D",
 "thumbnailUrl": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_t.jpg",
 "label": "9",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_48BD0607_5311_9FE4_41C5_6412DDC31075",
  "this.overlay_4F3DFF84_5310_ACE4_41CA_9B2F0282FD1B",
  "this.overlay_4F2FD24F_5313_B464_41CE_EC031E39639B"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -79.9,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6B231C63_7B0B_335E_41D8_387C08DE94ED"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -158.27,
   "backwardYaw": 98.91,
   "distance": 1,
   "panorama": "this.panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -53.64,
   "backwardYaw": 143.8,
   "distance": 1,
   "panorama": "this.panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 39.95,
   "backwardYaw": -161.91,
   "distance": 1,
   "panorama": "this.panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 121.22,
   "backwardYaw": -160.74,
   "distance": 1,
   "panorama": "this.panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5",
 "thumbnailUrl": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_t.jpg",
 "label": "11",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_48F4A4B9_5311_9C2C_41C9_2D15FAD0B69F",
  "this.overlay_4E0E54AB_5311_7C2C_41D2_478C621DB325",
  "this.overlay_4E65F22A_5310_942F_41A2_FDDCE668BF3A",
  "this.overlay_0F810A4B_53F0_B46C_41CE_EAB8D89B8C69"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -109.02,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_75C95DDB_7B0B_0D6F_41D7_71535DFD4591"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -38.58,
   "backwardYaw": 2.61,
   "distance": 1,
   "panorama": "this.panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 65.1,
   "backwardYaw": -152.23,
   "distance": 1,
   "panorama": "this.panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_37BF345B_3D7B_A913_418C_0BA72EB00126",
 "thumbnailUrl": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_t.jpg",
 "label": "24",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_60212AF3_5311_F43C_41A9_DE6045FFC037",
  "this.overlay_67A36BBD_5310_9425_41CD_E0A29FE650F0"
 ]
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -160.74,
   "backwardYaw": 121.22,
   "distance": 1,
   "panorama": "this.panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279",
 "thumbnailUrl": "media/panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_t.jpg",
 "label": "1792235563763_123183057331751718_6877668247949677281_6d00eb00848a2c37946a1cefdfd10826",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_72FCBA61_5331_745C_41C2_A05DABD8DEE2"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_camera"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 171.12,
   "backwardYaw": -1.44,
   "distance": 1,
   "panorama": "this.panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A",
 "thumbnailUrl": "media/panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_t.jpg",
 "label": "1792235565176_123183057331751718_6877668247949677281_941de05232a0db8c6f93d256860aa1c5",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_70F9F675_6B8E_386D_41B3_B1EF7547BA87"
 ]
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -103.36,
   "backwardYaw": 60.61,
   "distance": 1,
   "panorama": "this.panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 101.31,
   "backwardYaw": -81.96,
   "distance": 1,
   "panorama": "this.panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_582FA100_52F1_B5DC_41C4_9454C21B9532",
 "thumbnailUrl": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_t.jpg",
 "label": "1792235564347_123183057331751718_6877668247949677281_e38a0a8cc5bb79be6e0eba396bc72fb9",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_16D1B185_5370_94E4_41B5_7E96768D3381",
  "this.overlay_1A90069E_5377_7CE4_41CF_A1B69F54CA43"
 ]
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": 142.91,
   "backwardYaw": 167.11,
   "distance": 1,
   "panorama": "this.panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 41.19,
   "backwardYaw": 0.28,
   "distance": 1,
   "panorama": "this.panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": -81.96,
   "backwardYaw": 101.31,
   "distance": 1,
   "panorama": "this.panorama_582FA100_52F1_B5DC_41C4_9454C21B9532"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8",
 "thumbnailUrl": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_t.jpg",
 "label": "1792235564205_123183057331751718_6877668247949677281_e9160d46e21b3857da930ba66b0bf442",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_10A2B99B_5370_F4EC_41D3_2E4CBE2560B1",
  "this.overlay_173809B0_5373_943B_41D1_B86E169D8DB8",
  "this.overlay_1BB73574_5370_9C24_41D0_3CA686E09302"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -8.88,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_76E53CB7_7B0B_3327_41D0_AD5888D1130E"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -48.45,
   "backwardYaw": 87.65,
   "distance": 1,
   "panorama": "this.panorama_5813582E_52F1_B424_41D1_D69A96FEC19E"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 60.61,
   "backwardYaw": -103.36,
   "distance": 1,
   "panorama": "this.panorama_582FA100_52F1_B5DC_41C4_9454C21B9532"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4",
 "thumbnailUrl": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_t.jpg",
 "label": "1792235564408_123183057331751718_6877668247949677281_b15cc74a967647754172246e94bf5a4c",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_1BA0F675_5370_BC25_41D4_7C17500C84AB",
  "this.overlay_18FF449B_5371_BCEC_41D0_91EDA780594E"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 28.34,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6BDE8FF2_7B0B_0D39_41CF_176E04A33F3F"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_camera"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -8.84,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_6B328C71_7B0B_333B_41C1_D0CAB97F3A6F"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -42.72,
   "backwardYaw": 168.9,
   "distance": 1,
   "panorama": "this.panorama_37BDF644_3D7B_6976_41C0_850A6D00309F"
  },
  {
   "class": "AdjacentPanorama",
   "panorama": "this.panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_5810090E_52F1_95E4_41D0_057739B73120",
 "thumbnailUrl": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_t.jpg",
 "label": "dgnhanhdenha",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_4BAD4236_6B82_7BEE_41C4_150005CF9581",
  "this.overlay_4AD98625_6B82_1BED_41D5_9D0A169CA565"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 64.61,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_741EFB3C_7B0B_352A_41D3_F8E4AC2E2512"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 151.85,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_74D5EEC5_7B0B_0F5B_418C_B7A0C962B583"
},
{
 "hfovMin": "150%",
 "adjacentPanoramas": [
  {
   "class": "AdjacentPanorama",
   "yaw": -151.49,
   "backwardYaw": -27.31,
   "distance": 1,
   "panorama": "this.panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2"
  },
  {
   "class": "AdjacentPanorama",
   "yaw": 3.64,
   "backwardYaw": 108.38,
   "distance": 1,
   "panorama": "this.panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF"
  }
 ],
 "hfov": 360,
 "partial": false,
 "id": "panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56",
 "thumbnailUrl": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_t.jpg",
 "label": "1792235564843_123183057331751718_6877668247949677281_dd39f8a0171517dfd8a16b2f4cc5d75f",
 "pitch": 0,
 "hfovMax": 130,
 "class": "Panorama",
 "frames": [
  {
   "class": "CubicPanoramaFrame",
   "front": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_0/f/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_0/f/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "top": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_0/u/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_0/u/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "right": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_0/r/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_0/r/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "back": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_0/b/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_0/b/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "bottom": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_0/d/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_0/d/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "left": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_0/l/0/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 2,
      "tags": "ondemand",
      "colCount": 2,
      "width": 1024,
      "height": 1024
     },
     {
      "url": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_0/l/1/{row}_{column}.jpg",
      "class": "TiledImageResourceLevel",
      "rowCount": 1,
      "tags": [
       "ondemand",
       "preload"
      ],
      "colCount": 1,
      "width": 512,
      "height": 512
     }
    ]
   },
   "thumbnailUrl": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_t.jpg"
  }
 ],
 "vfov": 180,
 "overlays": [
  "this.overlay_03177CC9_53EF_6C6C_41BE_84DDEF583438",
  "this.overlay_009931EC_53EF_742B_41BF_F7AC1EAE1C46"
 ]
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": -169.29,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_74D6BC24_7B0B_32DA_41C8_CA9720E29019"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 169.98,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "camera_745CFE55_7B0B_0F7A_41C3_F0E3BCEE3570"
},
{
 "class": "PanoramaCamera",
 "automaticZoomSpeed": 10,
 "initialPosition": {
  "class": "PanoramaCameraPosition",
  "yaw": 0,
  "pitch": 0
 },
 "initialSequence": {
  "class": "PanoramaCameraSequence",
  "restartMovementOnUserInteraction": false,
  "movements": [
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_in",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "linear",
    "yawSpeed": 7.96,
    "yawDelta": 323
   },
   {
    "class": "DistancePanoramaCameraMovement",
    "easing": "cubic_out",
    "yawSpeed": 7.96,
    "yawDelta": 18.5
   }
  ]
 },
 "id": "panorama_69D7F613_5310_9FFC_41C6_DA5118062FEE_camera"
},
{
 "progressBarBorderColor": "#000000",
 "data": {
  "name": "Main Viewer"
 },
 "progressBackgroundColorDirection": "vertical",
 "id": "MainViewer",
 "progressBarBackgroundColorRatios": [
  0
 ],
 "playbackBarBottom": 5,
 "paddingLeft": 0,
 "playbackBarHeadOpacity": 1,
 "playbackBarHeadShadowHorizontalLength": 0,
 "progressBorderColor": "#000000",
 "toolTipBorderColor": "#767676",
 "toolTipShadowSpread": 0,
 "playbackBarProgressBackgroundColorDirection": "vertical",
 "progressBarBackgroundColor": [
  "#3399FF"
 ],
 "progressBackgroundColor": [
  "#FFFFFF"
 ],
 "width": "100%",
 "toolTipOpacity": 1,
 "toolTipFontSize": "1.11vmin",
 "playbackBarBackgroundColor": [
  "#FFFFFF"
 ],
 "playbackBarHeadWidth": 6,
 "toolTipShadowBlurRadius": 3,
 "playbackBarHeight": 10,
 "playbackBarBackgroundColorDirection": "vertical",
 "toolTipTextShadowColor": "#000000",
 "playbackBarRight": 0,
 "toolTipTextShadowBlurRadius": 3,
 "toolTipPaddingBottom": 4,
 "toolTipFontWeight": "normal",
 "playbackBarProgressBorderRadius": 0,
 "progressBarBorderRadius": 0,
 "progressBarBorderSize": 0,
 "playbackBarProgressBorderSize": 0,
 "height": "100%",
 "minHeight": 50,
 "toolTipShadowColor": "#333333",
 "playbackBarBorderRadius": 0,
 "playbackBarHeadBorderRadius": 0,
 "transitionMode": "blending",
 "class": "ViewerArea",
 "playbackBarHeadBorderColor": "#000000",
 "shadow": false,
 "toolTipShadowOpacity": 1,
 "minWidth": 100,
 "playbackBarProgressBorderColor": "#000000",
 "playbackBarHeadBorderSize": 0,
 "playbackBarProgressOpacity": 1,
 "toolTipFontStyle": "normal",
 "progressLeft": 0,
 "playbackBarBorderSize": 0,
 "toolTipShadowHorizontalLength": 0,
 "propagateClick": false,
 "playbackBarBackgroundOpacity": 1,
 "toolTipFontFamily": "Arial",
 "toolTipShadowVerticalLength": 0,
 "vrPointerSelectionColor": "#FF6600",
 "toolTipTextShadowOpacity": 0,
 "playbackBarHeadBackgroundColor": [
  "#111111",
  "#666666"
 ],
 "playbackBarHeadShadowColor": "#000000",
 "vrPointerSelectionTime": 2000,
 "paddingRight": 0,
 "firstTransitionDuration": 0,
 "progressOpacity": 1,
 "progressRight": 0,
 "borderSize": 0,
 "progressBarBackgroundColorDirection": "vertical",
 "playbackBarHeadShadow": true,
 "progressBottom": 0,
 "toolTipBackgroundColor": "#F6F6F6",
 "toolTipFontColor": "#606060",
 "progressHeight": 10,
 "playbackBarHeadBackgroundColorDirection": "vertical",
 "progressBackgroundOpacity": 1,
 "playbackBarProgressBackgroundColor": [
  "#3399FF"
 ],
 "playbackBarOpacity": 1,
 "displayTooltipInTouchScreens": true,
 "vrPointerColor": "#FFFFFF",
 "progressBarOpacity": 1,
 "playbackBarHeadShadowOpacity": 0.7,
 "playbackBarBorderColor": "#FFFFFF",
 "progressBorderSize": 0,
 "toolTipBorderSize": 1,
 "toolTipPaddingTop": 4,
 "toolTipPaddingLeft": 6,
 "progressBorderRadius": 0,
 "paddingTop": 0,
 "toolTipDisplayTime": 600,
 "playbackBarProgressBackgroundColorRatios": [
  0
 ],
 "playbackBarLeft": 0,
 "paddingBottom": 0,
 "toolTipPaddingRight": 6,
 "playbackBarHeadHeight": 15,
 "borderRadius": 0,
 "playbackBarHeadShadowBlurRadius": 3,
 "progressBackgroundColorRatios": [
  0
 ],
 "toolTipBorderRadius": 3,
 "playbackBarHeadBackgroundColorRatios": [
  0,
  1
 ],
 "transitionDuration": 500,
 "playbackBarHeadShadowVerticalLength": 0
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9, this.camera_74D5EEC5_7B0B_0F5B_418C_B7A0C962B583); this.mainPlayList.set('selectedIndex', 45)"
  }
 ],
 "data": {
  "label": "Arrow 04a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 16.39,
   "image": "this.AnimatedImageResource_497032EC_6B82_3863_41D6_CCB34FAA2965",
   "pitch": -13.72,
   "yaw": -156.19,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_718A0430_6B8E_7FE3_41BC_264E9898DCFE",
 "maps": [
  {
   "hfov": 16.39,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -156.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582E0176_52F1_9424_41BA_C3003357DF6B_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 22,
      "height": 16
     }
    ]
   },
   "pitch": -13.72
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE, this.camera_757DFD8D_7B0B_0DEB_41AF_2CA5A25544F2); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.6,
   "image": "this.AnimatedImageResource_4E2266E3_5310_9C5C_41D4_02A7E42103EC",
   "pitch": 4.2,
   "yaw": -2.53,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_44938019_5311_F3EC_41C1_00839DD38E45",
 "maps": [
  {
   "hfov": 17.6,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -2.53,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": 4.2
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D, this.camera_756B8D74_7B0B_0D3A_41C3_64EB49D7DC39); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "data": {
  "label": "Arrow 05a Right-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 22.68,
   "image": "this.AnimatedImageResource_4E2226E4_5310_9C24_41C9_353ABE088A5E",
   "pitch": -2.6,
   "yaw": 78.03,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_4907BA14_5310_97FB_41C3_C971B03338DF",
 "maps": [
  {
   "hfov": 22.68,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 78.03,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -2.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1, this.camera_7571DD81_7B0B_0DDB_41C9_3C12A6698DAD); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "data": {
  "label": "Arrow 05c Left-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 28.81,
   "image": "this.AnimatedImageResource_4E2296E4_5310_9C24_41A0_DD2AE87404F4",
   "pitch": 2.21,
   "yaw": -66.47,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_4AE38E70_5313_EC3C_41C8_D860C4AE53BB",
 "maps": [
  {
   "hfov": 28.81,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -66.47,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 44,
      "height": 16
     }
    ]
   },
   "pitch": 2.21
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE, this.camera_75B2CAD5_7B0B_377B_41D5_A7A37D953919); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 30.19,
   "image": "this.AnimatedImageResource_22E9C834_53F1_9424_41A2_155D00846DE6",
   "pitch": -13.92,
   "yaw": -77.49,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_49DC7510_5317_BDFC_41C2_E2788187E960",
 "maps": [
  {
   "hfov": 30.19,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -77.49,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -13.92
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA, this.camera_75C95DDB_7B0B_0D6F_41D7_71535DFD4591); this.mainPlayList.set('selectedIndex', 23)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 24.97,
   "image": "this.AnimatedImageResource_22E5B83C_53F1_9424_41B5_B285585252BF",
   "pitch": -15.29,
   "yaw": 5.36,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_7A0C6AC9_5330_B46C_41C6_57B7BB573317",
 "maps": [
  {
   "hfov": 24.97,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 5.36,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -15.29
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301, this.camera_75DB5DE8_7B0B_0D29_41C4_501A9FB1799E); this.mainPlayList.set('selectedIndex', 20)"
  }
 ],
 "data": {
  "label": "Arrow 05a Left-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 18.93,
   "image": "this.AnimatedImageResource_22E5483C_53F1_9424_41CE_019087C227F1",
   "pitch": -31.31,
   "yaw": -151.66,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_798B0D93_5331_6CFC_416D_B3E0EAAAD910",
 "maps": [
  {
   "hfov": 18.93,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -151.66,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -31.31
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 44)"
  }
 ],
 "data": {
  "label": "Arrow 05c Left-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 20.62,
   "image": "this.AnimatedImageResource_22C6B858_53F1_946C_41D4_861EB72AFA83",
   "pitch": -65.84,
   "yaw": -63.86,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_6859F7FF_5371_9C20_41C3_B250218E688E",
 "maps": [
  {
   "hfov": 20.62,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -63.86,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_69D7F613_5310_9FFC_41C6_DA5118062FEE_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 44,
      "height": 16
     }
    ]
   },
   "pitch": -65.84
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 31)"
  }
 ],
 "data": {
  "label": "Arrow 06a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 21.04,
   "image": "this.AnimatedImageResource_496A82F0_6B82_3862_41B7_22998D2208E6",
   "pitch": 7.38,
   "yaw": -6.52,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_72E25B46_6B8E_09AF_41D0_B1E1FC899608",
 "maps": [
  {
   "hfov": 21.04,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -6.52,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": 7.38
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31, this.camera_742EBB4E_7B0B_3569_41DB_03E7BA7F8DA5); this.mainPlayList.set('selectedIndex', 19)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 35.76,
   "image": "this.AnimatedImageResource_22E6383A_53F1_942C_41C0_1E815F523D51",
   "pitch": -10.06,
   "yaw": 13.8,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_7773FAD0_5331_947C_41A7_4A67F7D219FC",
 "maps": [
  {
   "hfov": 35.76,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 13.8,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -10.06
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 17)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 22.19,
   "image": "this.AnimatedImageResource_22E7983A_53F1_942C_41B2_A2BCE4061B00",
   "pitch": -32.91,
   "yaw": -83.32,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_7756713D_5330_F424_41D3_7837F884CE54",
 "maps": [
  {
   "hfov": 22.19,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -83.32,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -32.91
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 20)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 19.53,
   "image": "this.AnimatedImageResource_22E1783A_53F1_942C_41A7_2630388B5092",
   "pitch": -3.67,
   "yaw": 79.01,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_7788527A_533F_942C_41D2_9F909C192AB9",
 "maps": [
  {
   "hfov": 19.53,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 79.01,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -3.67
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BDF644_3D7B_6976_41C0_850A6D00309F, this.camera_6BCF0FE5_7B0B_0D5B_41D4_E7D0AEDD20AA); this.mainPlayList.set('selectedIndex', 21)"
  }
 ],
 "data": {
  "label": "Arrow 04c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 24.48,
   "image": "this.AnimatedImageResource_22E7083B_53F1_942C_41D3_3C3F498FE847",
   "pitch": -7.88,
   "yaw": 95.71,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_7504598F_5330_94E4_41D0_EA4EABF86FB7",
 "maps": [
  {
   "hfov": 24.48,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 95.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 38,
      "height": 16
     }
    ]
   },
   "pitch": -7.88
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408, this.camera_6BDE8FF2_7B0B_0D39_41CF_176E04A33F3F); this.mainPlayList.set('selectedIndex', 22)"
  }
 ],
 "data": {
  "label": "Arrow 05a Left-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 19.69,
   "image": "this.AnimatedImageResource_22E7783B_53F1_942C_4189_0501E2EC810E",
   "pitch": -0.61,
   "yaw": -23.41,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_7BD5847B_5330_9C2C_41D1_3FB930DD1BE8",
 "maps": [
  {
   "hfov": 19.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -23.41,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -0.61
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200, this.camera_748AABC8_7B0B_3569_41DA_2F3642256749); this.mainPlayList.set('selectedIndex', 4)"
  }
 ],
 "data": {
  "label": "Arrow 05a Left-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 23.9,
   "image": "this.AnimatedImageResource_4E23C6E3_5310_9C5C_41CE_07156EC19915",
   "pitch": -11.05,
   "yaw": -150.8,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_4BBF4FCE_5317_6C64_41C5_C2118212FEE0",
 "maps": [
  {
   "hfov": 23.9,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -150.8,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -11.05
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52, this.camera_747BDBB1_7B0B_353B_41DB_2A4EE1CD9332); this.mainPlayList.set('selectedIndex', 2)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.55,
   "image": "this.AnimatedImageResource_4E2386E3_5310_9C5C_41D3_6D76C287D1AB",
   "pitch": -6.23,
   "yaw": 4.12,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_4BFE04C3_5310_9C5D_418C_FA9A05611DC0",
 "maps": [
  {
   "hfov": 17.55,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 4.12,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -6.23
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37015C34_3D76_B916_41C4_D7B96DBCD969, this.camera_74A74BEC_7B0B_352A_41BC_DDFB1606BA73); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 21.04,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_1_HS_1_0.png",
      "class": "ImageResourceLevel",
      "width": 151,
      "height": 151
     }
    ]
   },
   "pitch": 7.79,
   "yaw": 113.68
  }
 ],
 "id": "overlay_45D332C8_5311_B46C_41CA_541CAB917B1C",
 "maps": [
  {
   "hfov": 21.04,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 113.68,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 7.79
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52, this.camera_74957BDA_7B0B_3569_41D7_4C2548E0418D); this.mainPlayList.set('selectedIndex', 2)"
  }
 ],
 "data": {
  "label": "Arrow 06a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 31.51,
   "image": "this.AnimatedImageResource_22EA082E_53F1_9424_41D3_3F8200659F95",
   "pitch": -13.97,
   "yaw": -160.74,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_482BCDED_5310_AC24_41C9_4AC6CA24FE4C",
 "maps": [
  {
   "hfov": 31.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -160.74,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -13.97
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8, this.camera_746B3B9F_7B0B_35E7_41CA_F26DBBD4C5CF); this.mainPlayList.set('selectedIndex', 32)"
  }
 ],
 "data": {
  "label": "Arrow 06a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 16.77,
   "image": "this.AnimatedImageResource_22D30847_53F1_9464_41B1_33CCD496F7E4",
   "pitch": -18.17,
   "yaw": 0.28,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_17DE0DA6_5371_EC24_41BD_74BEBCA20DA2",
 "maps": [
  {
   "hfov": 16.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 0.28,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -18.17
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2, this.camera_75BD0DCF_7B0B_0D66_41CB_563E42237D0A); this.mainPlayList.set('selectedIndex', 24)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 22.89,
   "image": "this.AnimatedImageResource_22C18852_53F1_947C_41C8_7D4089014E68",
   "pitch": -22.55,
   "yaw": 108.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_7FA8B903_5310_95DC_41D1_333BA9273154",
 "maps": [
  {
   "hfov": 22.89,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 108.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -22.55
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_41B59243_52F1_745C_41D2_0F074F5B396F, this.camera_75B0ADC2_7B0B_0D5E_41CB_942C129FB034); this.mainPlayList.set('selectedIndex', 55)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 16,
   "image": "this.AnimatedImageResource_22C11853_53F1_947C_419E_1B1009C139E0",
   "pitch": -24.95,
   "yaw": -48.45,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_7EA3FC9F_5311_ECE4_41C0_CE8748D70DE1",
 "maps": [
  {
   "hfov": 16,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -48.45,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -24.95
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2, this.camera_74109E19_7B0B_0EEB_41CC_8BAC9ADB78BF); this.mainPlayList.set('selectedIndex', 39)"
  }
 ],
 "data": {
  "label": "Arrow 04c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 24.11,
   "image": "this.AnimatedImageResource_22CBB84B_53F1_946C_41BA_B28F03DDF0AF",
   "pitch": -12.68,
   "yaw": -158.93,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_03488762_5310_BC5C_41D3_404982D3E7C6",
 "maps": [
  {
   "hfov": 24.11,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -158.93,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 38,
      "height": 16
     }
    ]
   },
   "pitch": -12.68
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543, this.camera_6B231C63_7B0B_335E_41D8_387C08DE94ED); this.mainPlayList.set('selectedIndex', 13)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.16,
   "image": "this.AnimatedImageResource_22DEB83E_53F1_9424_416C_6EAA7E6106B8",
   "pitch": -13.5,
   "yaw": 99.53,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_69D5E8C4_5371_B464_41BE_C12EF5EBEE3B",
 "maps": [
  {
   "hfov": 17.16,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 99.53,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -13.5
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E, this.camera_6B328C71_7B0B_333B_41C1_D0CAB97F3A6F); this.mainPlayList.set('selectedIndex', 29)"
  }
 ],
 "data": {
  "label": "Arrow 04a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 28.71,
   "image": "this.AnimatedImageResource_22DE283E_53F1_9424_41D3_A5386DD73462",
   "pitch": -13.29,
   "yaw": -107.87,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_686B61BB_5370_942C_41CE_9A9B8CD644BC",
 "maps": [
  {
   "hfov": 28.71,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -107.87,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 22,
      "height": 16
     }
    ]
   },
   "pitch": -13.29
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_594DA097_52F7_94E4_41C5_224F3338F6CC, this.camera_74795E6F_7B0B_0F26_41D5_F172CE2DACF6); this.mainPlayList.set('selectedIndex', 15)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 16.64,
   "image": "this.AnimatedImageResource_22E18839_53F1_942C_41CA_6EF67E31A5F9",
   "pitch": -19.48,
   "yaw": 13.05,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_71D7670B_5333_9DEC_41C5_1D5B60532171",
 "maps": [
  {
   "hfov": 16.64,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 13.05,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -19.48
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BFC891_3D7B_79EF_41CC_225FF205D876, this.camera_74893E7B_7B0B_0F2E_41CB_4EE25A0E8772); this.mainPlayList.set('selectedIndex', 17)"
  }
 ],
 "data": {
  "label": "Arrow 05c Right-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 33.18,
   "image": "this.AnimatedImageResource_22E1E839_53F1_942C_41C1_C7C33FAD0317",
   "pitch": -11.32,
   "yaw": 159.1,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_70CA303D_5333_B424_41C9_02E92928397D",
 "maps": [
  {
   "hfov": 33.18,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 159.1,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 44,
      "height": 16
     }
    ]
   },
   "pitch": -11.32
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F, this.camera_7406BE0C_7B0B_0EE9_41C7_A9EC35417688); this.mainPlayList.set('selectedIndex', 30)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 21.34,
   "image": "this.AnimatedImageResource_22DC7846_53F1_9464_41BE_ECEB483A390F",
   "pitch": -11.41,
   "yaw": 10.71,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_13C8AD8F_537F_ECE4_41D2_3D4E28F1851E",
 "maps": [
  {
   "hfov": 21.34,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 10.71,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -11.41
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8, this.camera_75F61E00_7B0B_0ED9_41DE_162F80C85A25); this.mainPlayList.set('selectedIndex', 32)"
  }
 ],
 "data": {
  "label": "Arrow 04c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 25.8,
   "image": "this.AnimatedImageResource_22DDE846_53F1_9464_41C1_88A7B4F5C713",
   "pitch": -12.47,
   "yaw": 167.11,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1181FBA2_5370_94DC_41C8_55EF5B202D9E",
 "maps": [
  {
   "hfov": 25.8,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 167.11,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 38,
      "height": 16
     }
    ]
   },
   "pitch": -12.47
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2, this.camera_6B72FF77_7B0B_0D26_41D3_23870D5CC40D); this.mainPlayList.set('selectedIndex', 24)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 31.84,
   "image": "this.AnimatedImageResource_22DA983C_53F1_9424_4196_67643D82B8FD",
   "pitch": -4.24,
   "yaw": 6.18,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_79946F23_532F_EDDC_41AD_13472CCB51CA",
 "maps": [
  {
   "hfov": 31.84,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 6.18,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -4.24
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408, this.camera_6B82CF89_7B0B_0DEA_41DC_39AD975C8B46); this.mainPlayList.set('selectedIndex', 22)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 24.78,
   "image": "this.AnimatedImageResource_22DA183C_53F1_9424_41D4_B1C40E64F495",
   "pitch": -18.67,
   "yaw": 70.98,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_795994A7_532F_BC24_41C3_848612638BDF",
 "maps": [
  {
   "hfov": 24.78,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 70.98,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -18.67
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5813582E_52F1_B424_41D1_D69A96FEC19E, this.camera_6B006C4B_7B0B_336E_4192_5CFA6690772F); this.mainPlayList.set('selectedIndex', 36)"
  }
 ],
 "data": {
  "label": "Arrow 06a Left-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 19.01,
   "image": "this.AnimatedImageResource_22D7C849_53F1_946C_41AA_38242BA33E76",
   "pitch": -6.23,
   "yaw": -115.39,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_1AFFF51E_5370_BDE4_41A5_D5C582FA3D92",
 "maps": [
  {
   "hfov": 19.01,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -115.39,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 29,
      "height": 16
     }
    ]
   },
   "pitch": -6.23
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5816F016_52F1_93E4_41C3_D978FA13AD04, this.camera_6B13EC57_7B0B_3367_41D3_50BDBBE1E0F6); this.mainPlayList.set('selectedIndex', 38)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 25.83,
   "image": "this.AnimatedImageResource_22D75849_53F1_946C_41C8_53942580BDEB",
   "pitch": -9.15,
   "yaw": -10.02,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1EECB4C8_536F_FC6C_41C1_700AD2DF09F2",
 "maps": [
  {
   "hfov": 25.83,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -10.02,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -9.15
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A, this.camera_76E53CB7_7B0B_3327_41D0_AD5888D1130E); this.mainPlayList.set('selectedIndex', 46)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 20.39,
   "image": "this.AnimatedImageResource_22CE084F_53F1_9465_41AB_FA5CC56B75DB",
   "pitch": -9.44,
   "yaw": -1.44,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_05DBF2A2_53F3_74DF_41D4_B8CE235CACB1",
 "maps": [
  {
   "hfov": 20.39,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -1.44,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -9.44
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5816F016_52F1_93E4_41C3_D978FA13AD04, this.camera_76ED3CD0_7B0B_3379_41C8_069DD9682647); this.mainPlayList.set('selectedIndex', 38)"
  }
 ],
 "data": {
  "label": "Arrow 05a Left-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 27.12,
   "image": "this.AnimatedImageResource_22CFB84F_53F1_9465_41D2_5DECB39F3EB6",
   "pitch": -13.79,
   "yaw": -153.99,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_099DB5A4_53F1_FC24_41D4_7EAB7D106D83",
 "maps": [
  {
   "hfov": 27.12,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -153.99,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -13.79
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_582E0176_52F1_9424_41BA_C3003357DF6B, this.camera_76E95CC4_7B0B_3359_41D8_7227FC397392); this.mainPlayList.set('selectedIndex', 47)"
  }
 ],
 "data": {
  "label": "Arrow 05a Left-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 19.03,
   "image": "this.AnimatedImageResource_22CF484F_53F1_9465_41C6_64E86EFF0F06",
   "pitch": -14.89,
   "yaw": -28.15,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_090345DA_53FF_BC6C_41BC_0EEB8BB618A5",
 "maps": [
  {
   "hfov": 19.03,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -28.15,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -14.89
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 21.91,
   "image": "this.AnimatedImageResource_22C3B851_53F1_947C_4193_E6BDE252F510",
   "pitch": -15.23,
   "yaw": -47.64,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_7C1FA4C0_5313_BC5C_41B7_E717CB2EB2CC",
 "data": {
  "label": "Arrow 05a Left-Up"
 },
 "maps": [
  {
   "hfov": 21.91,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -47.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -15.23
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968, this.camera_74499B77_7B0B_3526_41DC_568E85028B5C); this.mainPlayList.set('selectedIndex', 52)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 26.21,
   "image": "this.AnimatedImageResource_22C35852_53F1_947C_41C5_B910B00034B2",
   "pitch": -11.05,
   "yaw": 9.34,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_62D3050C_5310_9DE4_41C7_0AEFF03A2DA5",
 "maps": [
  {
   "hfov": 26.21,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 9.34,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -11.05
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28, this.camera_7439AB66_7B0B_3559_41C7_F077E1D2424A); this.mainPlayList.set('selectedIndex', 51)"
  }
 ],
 "data": {
  "label": "Arrow 05a Left-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 19.38,
   "image": "this.AnimatedImageResource_22C0F852_53F1_947C_41D3_3B865BCC2AB0",
   "pitch": -10.09,
   "yaw": 57.79,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_62A228B8_5311_F42C_419A_6B4AD98FBBDF",
 "maps": [
  {
   "hfov": 19.38,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 57.79,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -10.09
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37015C34_3D76_B916_41C4_D7B96DBCD969, this.camera_745BDB89_7B0B_35EA_41CF_21500749BE02); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 21.23,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0_HS_3_0.png",
      "class": "ImageResourceLevel",
      "width": 151,
      "height": 151
     }
    ]
   },
   "pitch": -1.2,
   "yaw": 83.75
  }
 ],
 "id": "overlay_7507584F_6BBE_17BD_41D0_9E9102B8194E",
 "maps": [
  {
   "hfov": 21.23,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 83.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -1.2
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 56)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 16.6,
   "image": "this.AnimatedImageResource_22CCE850_53F1_947C_41D2_F98DDC691705",
   "pitch": -19.89,
   "yaw": 3.37,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6556731B_5311_F5EC_41C0_5959A7757442",
 "maps": [
  {
   "hfov": 16.6,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 3.37,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -19.89
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BF345B_3D7B_A913_418C_0BA72EB00126, this.camera_751B60E4_7B0B_135A_41D0_3DE0AD81B70D); this.mainPlayList.set('selectedIndex', 25)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 15.17,
   "image": "this.AnimatedImageResource_22CD9850_53F1_947C_41D1_ACB645D198C3",
   "pitch": -30.73,
   "yaw": -152.23,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_69864EC9_536F_EC6C_41D3_8FD2542D7C2A",
 "maps": [
  {
   "hfov": 15.17,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -152.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -30.73
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_370142F7_3D76_A913_41BF_C1C74ADAC03A, this.camera_6BFEF00B_7B0B_12EF_41D1_8D6F07B2FB20); this.mainPlayList.set('selectedIndex', 12)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.65,
   "image": "this.AnimatedImageResource_22EC1837_53F1_9424_41D2_CA15B9717E09",
   "pitch": 1.25,
   "yaw": 32.13,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_4D614679_532F_9C2C_41B8_D528C3C19A17",
 "maps": [
  {
   "hfov": 17.65,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 32.13,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": 1.25
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5, this.camera_6A084018_7B0B_12E9_41AF_6450D6D738C3); this.mainPlayList.set('selectedIndex', 10)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.77,
   "image": "this.AnimatedImageResource_22ED8837_53F1_9424_41BF_5483CBE372B7",
   "pitch": -18.55,
   "yaw": 143.8,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_4D65473C_5330_FC2B_41BC_61F8097C41F9",
 "maps": [
  {
   "hfov": 17.77,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 143.8,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -18.55
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_58134031_52F1_B43C_41C6_897208B5BB0E, this.camera_75253D2B_7B0B_0D2F_41DA_E5429753D1EE); this.mainPlayList.set('selectedIndex', 14)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 27.23,
   "image": "this.AnimatedImageResource_22ED4837_53F1_9424_419B_BE7B371291E5",
   "pitch": -2.83,
   "yaw": 9.82,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_4DB4B390_5330_94FC_41D0_4B476B23A428",
 "maps": [
  {
   "hfov": 27.23,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 9.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -2.83
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5828C73D_52F1_7C24_41B2_772074CC709A, this.camera_751CAD1D_7B0B_32EA_41C5_C46F318D5DA1); this.mainPlayList.set('selectedIndex', 27)"
  }
 ],
 "data": {
  "label": "Arrow 04a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 19.32,
   "image": "this.AnimatedImageResource_22E29837_53F1_9424_41C2_C86E762AD72B",
   "pitch": 3.17,
   "yaw": 100.1,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_4DCDB712_5330_FDFC_41D2_F6E7422D4EC3",
 "maps": [
  {
   "hfov": 19.32,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 100.1,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 22,
      "height": 16
     }
    ]
   },
   "pitch": 3.17
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5, this.camera_75119D10_7B0B_32FA_41CE_65B306EE86E7); this.mainPlayList.set('selectedIndex', 10)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 25.11,
   "image": "this.AnimatedImageResource_22E21838_53F1_942C_41BC_25D9704C7EF5",
   "pitch": -7.67,
   "yaw": -161.91,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_4DD083D2_5330_947F_41D1_C4B4B89D46A0",
 "maps": [
  {
   "hfov": 25.11,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -161.91,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -7.67
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "items": [
  {
   "hfov": 25.88,
   "image": "this.AnimatedImageResource_22C9E84E_53F1_9467_41D2_BCCE34007D6D",
   "pitch": -0.93,
   "yaw": -3.7,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "useHandCursor": true,
 "areas": [
  {
   "mapColor": "#FF0000",
   "class": "HotspotPanoramaOverlayArea"
  }
 ],
 "id": "overlay_05E85800_53F7_F3DC_41D3_17DC1317AB28",
 "data": {
  "label": "Arrow 04b"
 },
 "maps": [
  {
   "hfov": 25.88,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -3.7,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -0.93
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_58121349_52F1_F46C_41C1_961015C5B031, this.camera_751160D7_7B0B_1367_41B4_C60E28A39DF2); this.mainPlayList.set('selectedIndex', 43)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 25.08,
   "image": "this.AnimatedImageResource_22C9784E_53F1_9467_41D3_BD092B776D85",
   "pitch": -20.13,
   "yaw": -143.93,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_053F76A8_53F0_BC2C_41C0_ABD2F9DC7E8F",
 "maps": [
  {
   "hfov": 25.08,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -143.93,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -20.13
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF, this.camera_7432FE31_7B0B_0F3A_41D2_80FD2E542F21); this.mainPlayList.set('selectedIndex', 42)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 22.76,
   "image": "this.AnimatedImageResource_22C8E84D_53F1_9465_41A3_C3C251DA1890",
   "pitch": -20.11,
   "yaw": 1.38,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_01B529EF_53F3_9424_41D4_1BF97ECDCB18",
 "maps": [
  {
   "hfov": 22.76,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 1.38,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -20.11
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3, this.camera_74235E26_7B0B_0ED9_41CF_C08E6573266B); this.mainPlayList.set('selectedIndex', 44)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.8,
   "image": "this.AnimatedImageResource_22C8684E_53F1_9467_4184_DD24789E6970",
   "pitch": -24.52,
   "yaw": 170.22,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_06E16EF5_53F1_6C24_41CD_B60BACBBC9F0",
 "maps": [
  {
   "hfov": 17.8,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 170.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -24.52
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BF345B_3D7B_A913_418C_0BA72EB00126, this.camera_75EF0B07_7B0B_36E7_41D1_3847E1B0800C); this.mainPlayList.set('selectedIndex', 25)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.11,
   "image": "this.AnimatedImageResource_22CD0850_53F1_947C_41D2_6B56D02D0A6F",
   "pitch": -14.26,
   "yaw": 2.61,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6142D722_531F_9DDC_41CE_FBD400BA2830",
 "maps": [
  {
   "hfov": 17.11,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 2.61,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -14.26
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_41B17B3C_52F0_9424_41A1_390023C55BE4, this.camera_75FFCB13_7B0B_36FF_41DD_0B9C2AFD2030); this.mainPlayList.set('selectedIndex', 53)"
  }
 ],
 "data": {
  "label": "Arrow 05a Left-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 32.25,
   "image": "this.AnimatedImageResource_22C28851_53F1_947C_41C6_94B4F01263B0",
   "pitch": -33.41,
   "yaw": -102.69,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_60F4E67D_5310_9C25_41C7_23BFD3ABBD07",
 "maps": [
  {
   "hfov": 32.25,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -102.69,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -33.41
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56, this.camera_750A3D04_7B0B_32DA_4196_8E0495EDF77A); this.mainPlayList.set('selectedIndex', 41)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.45,
   "image": "this.AnimatedImageResource_22CBD84D_53F1_9465_41C4_E37E1D87FCCE",
   "pitch": -8.63,
   "yaw": 108.38,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_02A91049_53F1_946C_41C2_08E802E6BF95",
 "maps": [
  {
   "hfov": 17.45,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 108.38,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -8.63
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_58121349_52F1_F46C_41C1_961015C5B031, this.camera_75024CF7_7B0B_3326_41D0_0C108900401E); this.mainPlayList.set('selectedIndex', 43)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 20.89,
   "image": "this.AnimatedImageResource_22CB484D_53F1_9465_4171_38C8B07E0C18",
   "pitch": -4.14,
   "yaw": -95.95,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_012B2C04_53F0_B3DB_41D1_D07AC930C1CA",
 "maps": [
  {
   "hfov": 20.89,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -95.95,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -4.14
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E, this.camera_74E68C31_7B0B_333A_41B5_61275AF7F2A8); this.mainPlayList.set('selectedIndex', 29)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 19.13,
   "image": "this.AnimatedImageResource_22DF7840_53F1_945C_41CF_7F6AF574D2D3",
   "pitch": -12.2,
   "yaw": 102.39,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6C104CB5_5370_AC24_41CC_F0434F1FEBD5",
 "maps": [
  {
   "hfov": 19.13,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 102.39,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -12.2
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C, this.camera_74D6BC24_7B0B_32DA_41C8_CA9720E29019); this.mainPlayList.set('selectedIndex', 31)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 22.67,
   "image": "this.AnimatedImageResource_22DCF845_53F1_9464_41A3_186795D7C7D3",
   "pitch": -7.52,
   "yaw": -98.28,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_135F8526_5370_9C24_41CA_4EDDE0D52BA0",
 "maps": [
  {
   "hfov": 22.67,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -98.28,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -7.52
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1, this.camera_74E48ED7_7B0B_0F67_41BB_4ABDBB17859D); this.mainPlayList.set('selectedIndex', 3)"
  }
 ],
 "data": {
  "label": "Arrow 05a Right-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 31.57,
   "image": "this.AnimatedImageResource_4E20B6E3_5310_9C5C_41D0_E306EED8AC80",
   "pitch": -34.32,
   "yaw": 158.12,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_450BA067_5313_B425_41D0_E9B9AEBE596E",
 "maps": [
  {
   "hfov": 31.57,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 158.12,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -34.32
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37B158A5_3D7A_9937_41A9_E252B459A742, this.camera_74F49EE8_7B0B_0F2A_4199_64626F6A5A38); this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "data": {
  "label": "Arrow 03"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 22.18,
   "image": "this.AnimatedImageResource_4E2366E3_5310_9C5C_4167_A7416239448E",
   "pitch": -9.67,
   "yaw": -20.84,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_44DF5F4E_5310_AC64_41D0_19EBD5274A30",
 "maps": [
  {
   "hfov": 22.18,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -20.84,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 19,
      "height": 16
     }
    ]
   },
   "pitch": -9.67
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_41B17B3C_52F0_9424_41A1_390023C55BE4, this.camera_6B633F64_7B0B_0D5A_41C8_BB5FFB3FB4C1); this.mainPlayList.set('selectedIndex', 53)"
  }
 ],
 "data": {
  "label": "Arrow 05c Right-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 27.67,
   "image": "this.AnimatedImageResource_22C21851_53F1_947C_41C3_F86D904681DE",
   "pitch": -16.32,
   "yaw": 122.89,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_62DE2D55_5310_EC64_41BF_66633B8B0843",
 "maps": [
  {
   "hfov": 27.67,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 122.89,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 44,
      "height": 16
     }
    ]
   },
   "pitch": -16.32
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5816F016_52F1_93E4_41C3_D978FA13AD04, this.camera_75A2CAC8_7B0B_3769_41BF_E5E270889688); this.mainPlayList.set('selectedIndex', 38)"
  }
 ],
 "data": {
  "label": "Arrow 06b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 20.58,
   "image": "this.AnimatedImageResource_496B02F0_6B82_3862_41C7_B3C75E2E565B",
   "pitch": 2.08,
   "yaw": -70.11,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_7D0BFDC1_6B82_08A5_41D6_8A66C21AD201",
 "maps": [
  {
   "hfov": 20.58,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -70.11,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 32,
      "height": 16
     }
    ]
   },
   "pitch": 2.08
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2, this.camera_75930ABB_7B0B_372E_41DA_D5D078780CAD); this.mainPlayList.set('selectedIndex', 39)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.63,
   "image": "this.AnimatedImageResource_496BB2F0_6B82_3862_41D3_2F4F5466D538",
   "pitch": -3,
   "yaw": 5.63,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_7D7EA2C5_6B83_F8AD_4191_AE7793EB9835",
 "maps": [
  {
   "hfov": 17.63,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 5.63,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -3
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 45)"
  }
 ],
 "data": {
  "label": "Arrow 05a Left"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 26.32,
   "image": "this.AnimatedImageResource_496812F1_6B82_3862_41C6_315450D90F39",
   "pitch": -6.22,
   "yaw": -90.59,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_73E5ED80_6B82_08A3_41D1_7D783506196A",
 "maps": [
  {
   "hfov": 26.32,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -90.59,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 41,
      "height": 16
     }
    ]
   },
   "pitch": -6.22
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301, this.camera_75C2CAE0_7B0B_375A_41CB_46F62F344E02); this.mainPlayList.set('selectedIndex', 20)"
  }
 ],
 "data": {
  "label": "Arrow 04c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 28.38,
   "image": "this.AnimatedImageResource_22E4D83C_53F1_9424_41D1_CEA021E00C12",
   "pitch": -16.85,
   "yaw": -83.29,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_75498522_5331_9DDF_41D3_CCB29D6AA4F3",
 "maps": [
  {
   "hfov": 28.38,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -83.29,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 38,
      "height": 16
     }
    ]
   },
   "pitch": -16.85
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5810090E_52F1_95E4_41D0_057739B73120, this.camera_75CC7AED_7B0B_372A_41C0_C249409A83C4); this.mainPlayList.set('selectedIndex', 48)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 19.32,
   "image": "this.AnimatedImageResource_22E4483C_53F1_9424_41D1_1CB54C700BDF",
   "pitch": -16.09,
   "yaw": 168.9,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_740AF0A1_5330_B4DD_41A9_39CEC62B003D",
 "maps": [
  {
   "hfov": 19.32,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 168.9,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -16.09
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37015C34_3D76_B916_41C4_D7B96DBCD969, this.camera_75DC0AF9_7B0B_372A_41D2_7F34A312CBEF); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 25.92,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0_HS_2_0.png",
      "class": "ImageResourceLevel",
      "width": 190,
      "height": 193
     }
    ]
   },
   "pitch": 14.13,
   "yaw": 63.31
  }
 ],
 "id": "overlay_75824498_6B82_18A3_41D2_EAD19ADFA709",
 "maps": [
  {
   "hfov": 25.92,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 63.31,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 14.13
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D, this.camera_75830AAE_7B0B_3726_41CD_4A395F4FEA76); this.mainPlayList.set('selectedIndex', 54)"
  }
 ],
 "data": {
  "label": "Arrow 04a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 24.26,
   "image": "this.AnimatedImageResource_22DB983D_53F1_9424_41AC_2E0EDBC8CD24",
   "pitch": -2.78,
   "yaw": 15.82,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_789E4193_5310_F4FC_41D0_3CC17FC0330E",
 "maps": [
  {
   "hfov": 24.26,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 15.82,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 22,
      "height": 16
     }
    ]
   },
   "pitch": -2.78
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA, this.camera_7571FAA2_7B0B_37D9_41BE_23B4C228F457); this.mainPlayList.set('selectedIndex', 23)"
  }
 ],
 "data": {
  "label": "Arrow 05a Left-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 19.33,
   "image": "this.AnimatedImageResource_22DB183D_53F1_9424_41CA_CEB085504B8B",
   "pitch": -10.91,
   "yaw": -161.37,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_7D70493F_5317_9424_41AF_1D2787E83538",
 "maps": [
  {
   "hfov": 19.33,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -161.37,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -10.91
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 53)"
  }
 ],
 "data": {
  "label": "Arrow 05c Right-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 32.12,
   "image": "this.AnimatedImageResource_22D8983D_53F1_9424_41A4_8A5AD9D0FF10",
   "pitch": -0.53,
   "yaw": -45.27,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_621196D6_5310_9C64_41CF_6B4F9F93A5F3",
 "maps": [
  {
   "hfov": 32.12,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -45.27,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 44,
      "height": 16
     }
    ]
   },
   "pitch": -0.53
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37015C34_3D76_B916_41C4_D7B96DBCD969, this.camera_7561FA93_7B0B_37FE_41D0_312F9508AEA9); this.mainPlayList.set('selectedIndex', 0)"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 23.76,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0_HS_3_0.png",
      "class": "ImageResourceLevel",
      "width": 174,
      "height": 178
     }
    ]
   },
   "pitch": 14.38,
   "yaw": 62.34
  }
 ],
 "id": "overlay_75C99D11_6BBE_09A2_41D8_40B2C1F42085",
 "maps": [
  {
   "hfov": 23.76,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 62.34,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": 14.38
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56, this.camera_7553CD5D_7B0B_0D6B_41D2_9FF43A18B892); this.mainPlayList.set('selectedIndex', 41)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.65,
   "image": "this.AnimatedImageResource_22CAA84A_53F1_946C_4193_35F0C0165F45",
   "pitch": 0.84,
   "yaw": -27.31,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_03F3CEAE_5310_AC24_4170_3416F4FC33A5",
 "maps": [
  {
   "hfov": 17.65,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -27.31,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": 0.84
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4, this.camera_75444D4F_7B0B_0D67_41DB_01D4024841C3); this.mainPlayList.set('selectedIndex', 40)"
  }
 ],
 "data": {
  "label": "Arrow 05a Left-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 19.64,
   "image": "this.AnimatedImageResource_22CA184B_53F1_946C_41C3_D53F1E0C44F0",
   "pitch": -3.91,
   "yaw": -90.06,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_1D8C6C18_5311_93EC_41B5_6827E6B14AF9",
 "maps": [
  {
   "hfov": 19.64,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -90.06,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -3.91
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244, this.camera_753EAD43_7B0B_0D5E_41DD_2B63A0DBC2B9); this.mainPlayList.set('selectedIndex', 59)"
  }
 ],
 "data": {
  "label": "Arrow 06a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 24.44,
   "image": "this.AnimatedImageResource_48116637_6B82_FBED_41B3_2CB8F9BB9E9F",
   "pitch": -12.64,
   "yaw": 161.62,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_4AF490E4_6B82_1863_41D9_24ACCA9BDB52",
 "maps": [
  {
   "hfov": 24.44,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 161.62,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -12.64
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_594DA097_52F7_94E4_41C5_224F3338F6CC, this.camera_6B062EF9_7B0B_0F2A_41C8_2EBC542B6E4C); this.mainPlayList.set('selectedIndex', 15)"
  }
 ],
 "data": {
  "label": "Arrow 06a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.65,
   "image": "this.AnimatedImageResource_22E38838_53F1_942C_41CC_B3E15BC0E5C3",
   "pitch": -0.26,
   "yaw": -0.41,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_73F250F2_5330_B43C_41C4_6F1631C7BFB6",
 "maps": [
  {
   "hfov": 17.65,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -0.41,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -0.26
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5816F016_52F1_93E4_41C3_D978FA13AD04, this.camera_6B26DF1D_7B0B_0EEB_41D6_7E168BAD88A4); this.mainPlayList.set('selectedIndex', 38)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 14.9,
   "image": "this.AnimatedImageResource_22E3C838_53F1_942C_41C9_0457EB10D0F5",
   "pitch": 0.12,
   "yaw": 25.33,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_73B00EA9_5337_EC2C_41C7_E15E0C82775C",
 "maps": [
  {
   "hfov": 14.9,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 25.33,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": 0.12
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543, this.camera_6B163F0B_7B0B_0EEE_41D8_69182548B016); this.mainPlayList.set('selectedIndex', 13)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 20.1,
   "image": "this.AnimatedImageResource_22E34838_53F1_942C_41BC_A3B46B2A3DCD",
   "pitch": -2.57,
   "yaw": 159.23,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_72E600FC_5330_9424_41BF_6E1C61F3CAD4",
 "maps": [
  {
   "hfov": 20.1,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 159.23,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -2.57
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 19)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 23.69,
   "image": "this.AnimatedImageResource_22E14839_53F1_942C_41A8_DD55E3DFAB54",
   "pitch": -25.09,
   "yaw": -69.52,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_70A10999_5330_F4EC_4188_8472B4DF7754",
 "maps": [
  {
   "hfov": 23.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -69.52,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -25.09
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060, this.camera_76E9AA1C_7B0B_36EA_41B1_64FC182D4FC4); this.mainPlayList.set('selectedIndex', 16)"
  }
 ],
 "data": {
  "label": "Arrow 05a Right-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 26.85,
   "image": "this.AnimatedImageResource_22E6B839_53F1_942C_41C2_93E139E32180",
   "pitch": -30.68,
   "yaw": 86.34,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_70538411_5330_93FC_41BA_58465835C5C3",
 "maps": [
  {
   "hfov": 26.85,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 86.34,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -30.68
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060, this.camera_74B73BFD_7B0B_352A_41D8_E4C117B5FCE5); this.mainPlayList.set('selectedIndex', 16)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 20.36,
   "image": "this.AnimatedImageResource_22E0B839_53F1_942C_41D2_9614D885CE40",
   "pitch": -13.54,
   "yaw": 6.46,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_72AAA66E_5331_FC24_41D1_88663E4F0231",
 "maps": [
  {
   "hfov": 20.36,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 6.46,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -13.54
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_58134031_52F1_B43C_41C6_897208B5BB0E, this.camera_74C6BC0F_7B0B_32E7_41CA_7B84E09F3539); this.mainPlayList.set('selectedIndex', 14)"
  }
 ],
 "data": {
  "label": "Arrow 05a Left-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 22.76,
   "image": "this.AnimatedImageResource_22E01839_53F1_942C_41A7_E830946FE10C",
   "pitch": -35.41,
   "yaw": -147.03,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_704BB634_5331_9C3B_41A8_BD3F9249E154",
 "maps": [
  {
   "hfov": 22.76,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -147.03,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -35.41
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 20)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 20.01,
   "image": "this.AnimatedImageResource_22E6D83A_53F1_942C_418F_966AB46DA474",
   "pitch": -6.01,
   "yaw": 6.8,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_77CE0F9B_5330_ACED_41C9_02802FB29B87",
 "maps": [
  {
   "hfov": 20.01,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 6.8,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -6.01
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 20)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 22.56,
   "image": "this.AnimatedImageResource_22E6383B_53F1_942C_41C4_F0883C608DA1",
   "pitch": -12.89,
   "yaw": 88.34,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_751D6E5E_5330_AC64_41C4_8315BCD0FEC5",
 "maps": [
  {
   "hfov": 22.56,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 88.34,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -12.89
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB, this.camera_75303D37_7B0B_0D27_41C0_B5E7D9CD2DA2); this.mainPlayList.set('selectedIndex', 18)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 14.55,
   "image": "this.AnimatedImageResource_22E7983B_53F1_942C_41B0_495FD3299B6B",
   "pitch": -52.61,
   "yaw": -157.72,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_760721AF_5331_9425_41D1_9406F22B71B5",
 "maps": [
  {
   "hfov": 14.55,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -157.72,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -52.61
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37B158A5_3D7A_9937_41A9_E252B459A742, this.camera_7557EA86_7B0B_37D9_41DA_E776F212A6B1); this.mainPlayList.set('selectedIndex', 1)"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.58,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_1_HS_1_0.png",
      "class": "ImageResourceLevel",
      "width": 70,
      "height": 44
     }
    ]
   },
   "pitch": -9.68,
   "yaw": -18.5
  }
 ],
 "id": "overlay_5CF9F322_52F3_F5DC_417F_CDCF5D51ECFD",
 "maps": [
  {
   "hfov": 7.58,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -18.5,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 25,
      "height": 16
     }
    ]
   },
   "pitch": -9.68
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BDF644_3D7B_6976_41C0_850A6D00309F, this.camera_75471A78_7B0B_372A_4193_BE46CBD9B2A6); this.mainPlayList.set('selectedIndex', 21)"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.07,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_1_HS_2_0.png",
      "class": "ImageResourceLevel",
      "width": 67,
      "height": 49
     }
    ]
   },
   "pitch": -12.99,
   "yaw": 1.39
  }
 ],
 "id": "overlay_5C874AEF_52F3_7425_41D3_9F75D9D6C2E8",
 "maps": [
  {
   "hfov": 7.07,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 1.39,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 21,
      "height": 15
     }
    ]
   },
   "pitch": -12.99
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 44)"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 6.42,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_1_HS_3_0.png",
      "class": "ImageResourceLevel",
      "width": 60,
      "height": 42
     }
    ]
   },
   "pitch": -9,
   "yaw": 15.74
  }
 ],
 "id": "overlay_5CFBC4FB_52F0_9C2C_41C7_893041E79E69",
 "maps": [
  {
   "hfov": 6.42,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 15.74,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_1_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 22,
      "height": 16
     }
    ]
   },
   "pitch": -9
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2, this.camera_752A1A5E_7B0B_3766_4199_C722E2C72613); this.mainPlayList.set('selectedIndex', 24)"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 6.78,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_1_HS_4_0.png",
      "class": "ImageResourceLevel",
      "width": 62,
      "height": 41
     }
    ]
   },
   "pitch": -0.92,
   "yaw": -12.79
  }
 ],
 "id": "overlay_42637E71_52F0_AC3C_41C4_DFAD03997E37",
 "maps": [
  {
   "hfov": 6.78,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -12.79,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_1_HS_4_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -0.92
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 19)"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 7.03,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_1_HS_5_0.png",
      "class": "ImageResourceLevel",
      "width": 65,
      "height": 42
     }
    ]
   },
   "pitch": -9.69,
   "yaw": -5.24
  }
 ],
 "id": "overlay_4261C9A2_52F1_B4DC_41C3_D9B250598411",
 "maps": [
  {
   "hfov": 7.03,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -5.24,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_1_HS_5_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -9.69
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_41B17B3C_52F0_9424_41A1_390023C55BE4, this.camera_75349A6B_7B0B_372F_41A1_E64E2CD39F24); this.mainPlayList.set('selectedIndex', 53)"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 5.71,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_1_HS_6_0.png",
      "class": "ImageResourceLevel",
      "width": 52,
      "height": 47
     }
    ]
   },
   "pitch": 5.58,
   "yaw": 3.14
  }
 ],
 "id": "overlay_400313E9_52F7_F42C_41B9_594A53EB2E40",
 "maps": [
  {
   "hfov": 5.71,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 3.14,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_1_HS_6_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 17,
      "height": 16
     }
    ]
   },
   "pitch": 5.58
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 56)"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 5.94,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_0_HS_7_0.png",
      "class": "ImageResourceLevel",
      "width": 55,
      "height": 50
     }
    ]
   },
   "pitch": -10.53,
   "yaw": 7.93
  }
 ],
 "id": "overlay_691FC70E_5373_9DE7_41CF_C9B290F4EA9F",
 "maps": [
  {
   "hfov": 5.94,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 7.93,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_0_HS_7_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 17,
      "height": 16
     }
    ]
   },
   "pitch": -10.53
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 46)"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 4.51,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_0_HS_8_0.png",
      "class": "ImageResourceLevel",
      "width": 42,
      "height": 46
     }
    ]
   },
   "pitch": 9.36,
   "yaw": -24.77
  }
 ],
 "id": "overlay_7147082E_6B82_17FF_41CA_4D5CBC6DF2DD",
 "maps": [
  {
   "hfov": 4.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -24.77,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_0_HS_8_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 17
     }
    ]
   },
   "pitch": 9.36
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 34)"
  }
 ],
 "data": {
  "label": "Image"
 },
 "useHandCursor": true,
 "items": [
  {
   "class": "HotspotPanoramaOverlayImage",
   "hfov": 6.44,
   "distance": 50,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_0_HS_9_0.png",
      "class": "ImageResourceLevel",
      "width": 59,
      "height": 62
     }
    ]
   },
   "pitch": -6.29,
   "yaw": 27.87
  }
 ],
 "id": "overlay_77F178E7_6B86_086E_41C5_2119DBD561E0",
 "maps": [
  {
   "hfov": 6.44,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 27.87,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37015C34_3D76_B916_41C4_D7B96DBCD969_0_HS_9_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 16,
      "height": 16
     }
    ]
   },
   "pitch": -6.29
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F, this.camera_6B92EF9D_7B0B_0DEB_41AF_943BEF57CF3F); this.mainPlayList.set('selectedIndex', 30)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.32,
   "image": "this.AnimatedImageResource_22DF383F_53F1_9424_419F_4F686704683B",
   "pitch": -11.03,
   "yaw": 6.66,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6EE4214E_5377_7462_419D_4C830F9CF434",
 "maps": [
  {
   "hfov": 17.32,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 6.66,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -11.03
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 14)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 22.42,
   "image": "this.AnimatedImageResource_22DCB83F_53F1_9424_41C5_A69FF89CBC67",
   "pitch": -7.14,
   "yaw": -103.22,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6C9BF1FB_5371_742C_41B0_976A0933004C",
 "maps": [
  {
   "hfov": 22.42,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -103.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -7.14
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E, this.camera_6BAC4FC0_7B0B_0D5A_41D7_6F9BFF7A7F1B); this.mainPlayList.set('selectedIndex', 28)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 22.96,
   "image": "this.AnimatedImageResource_22DCF83F_53F1_9424_417B_78043CAD8867",
   "pitch": -14.22,
   "yaw": 104.2,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6C6D9DD0_5371_AC7C_41BE_DE2BE7CAB620",
 "maps": [
  {
   "hfov": 22.96,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 104.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -14.22
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5828C73D_52F1_7C24_41B2_772074CC709A, this.camera_6B9DAFAF_7B0B_0D27_41DB_A1C84E9E61C6); this.mainPlayList.set('selectedIndex', 27)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 25.68,
   "image": "this.AnimatedImageResource_22DC683F_53F1_9424_41D1_EA5822C93B7D",
   "pitch": -7.02,
   "yaw": 171.16,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6D6ECA7D_5370_9424_41C2_31FFF975020D",
 "maps": [
  {
   "hfov": 25.68,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 171.16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -7.02
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D, this.camera_75183A51_7B0B_377A_41BA_E4D73BCA0501); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.08,
   "image": "this.AnimatedImageResource_22EF8836_53F1_9424_41D2_DC13E298F182",
   "pitch": -14.6,
   "yaw": 2.2,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_4F713858_5310_F46B_41D3_B9EFD9EE39E8",
 "maps": [
  {
   "hfov": 17.08,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 2.2,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -14.6
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE, this.camera_75A73DB6_7B0B_0D39_41C7_99C0F4E1AC10); this.mainPlayList.set('selectedIndex', 5)"
  }
 ],
 "data": {
  "label": "Arrow 06b Right-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 25.06,
   "image": "this.AnimatedImageResource_22E91834_53F1_9424_41D2_FCD94F9DA203",
   "pitch": -8.39,
   "yaw": 81.27,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_49CB1FC6_5310_EC64_41BC_AB66EB429656",
 "maps": [
  {
   "hfov": 25.06,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 81.27,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 34,
      "height": 16
     }
    ]
   },
   "pitch": -8.39
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8, this.camera_745CFE55_7B0B_0F7A_41C3_F0E3BCEE3570); this.mainPlayList.set('selectedIndex', 37)"
  }
 ],
 "data": {
  "label": "Arrow 05a Right-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 19.62,
   "image": "this.AnimatedImageResource_22D4C84A_53F1_946C_419F_EF14B747B3A4",
   "pitch": -4.73,
   "yaw": 104.46,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_036FDE21_5310_EFDC_41D0_5C0EF79FFC40",
 "maps": [
  {
   "hfov": 19.62,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 104.46,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -4.73
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_58134031_52F1_B43C_41C6_897208B5BB0E, this.camera_746F7E62_7B0B_0F5E_419D_1A7F967D9B8E); this.mainPlayList.set('selectedIndex', 14)"
  }
 ],
 "data": {
  "label": "Arrow 05c Left"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 36.84,
   "image": "this.AnimatedImageResource_22D4584A_53F1_946C_41C4_FD2DCA567CB3",
   "pitch": 6.26,
   "yaw": -129.48,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_1C732C26_5310_EC24_41A0_D5647CABE91C",
 "maps": [
  {
   "hfov": 36.84,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -129.48,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 57,
      "height": 16
     }
    ]
   },
   "pitch": 6.26
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244, this.camera_744C9E4A_7B0B_0F69_41DB_2C78F6A1F65F); this.mainPlayList.set('selectedIndex', 59)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.37,
   "image": "this.AnimatedImageResource_22D5B84A_53F1_946C_41CA_D23692535547",
   "pitch": -0.93,
   "yaw": -38.96,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1EDD4A15_5313_B7E4_41D2_F5AE3103D8A6",
 "maps": [
  {
   "hfov": 17.37,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -38.96,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -0.93
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9, this.camera_7442BE3D_7B0B_0F2A_41D9_CFEDC590C950); this.mainPlayList.set('selectedIndex', 45)"
  }
 ],
 "data": {
  "label": "Arrow 05c Right-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 15.89,
   "image": "this.AnimatedImageResource_22D5084A_53F1_946C_41B6_EE4A7D1EF05D",
   "pitch": -3.48,
   "yaw": -25.16,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_0F912236_53F1_7424_41B4_61DA6C7DFCE0",
 "maps": [
  {
   "hfov": 15.89,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -25.16,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 44,
      "height": 16
     }
    ]
   },
   "pitch": -3.48
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8, this.camera_6A6A0064_7B0B_135A_41D1_E8DA021D5FE5); this.mainPlayList.set('selectedIndex', 7)"
  }
 ],
 "data": {
  "label": "Arrow 05"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 19.67,
   "image": "this.AnimatedImageResource_4E2566E4_5310_9C24_41C6_12EF009F11BE",
   "pitch": -4.51,
   "yaw": 12.17,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_4B95915E_5310_B464_41CC_322FF500A125",
 "maps": [
  {
   "hfov": 19.67,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 12.17,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_1_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 30,
      "height": 16
     }
    ]
   },
   "pitch": -4.51
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F, this.camera_750DE0CB_7B0B_136E_41DA_6C3754EABD82); this.mainPlayList.set('selectedIndex', 6)"
  }
 ],
 "data": {
  "label": "Arrow 05c Right-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 21.59,
   "image": "this.AnimatedImageResource_4E25C6E4_5310_9C24_41D0_D51BC953650A",
   "pitch": -21.06,
   "yaw": 155.74,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_49039C0F_5310_93E4_41A6_130972224591",
 "maps": [
  {
   "hfov": 21.59,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 155.74,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_1_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 44,
      "height": 16
     }
    ]
   },
   "pitch": -21.06
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200, this.camera_6A759073_7B0B_133F_41C3_D6FA0BF88204); this.mainPlayList.set('selectedIndex', 4)"
  }
 ],
 "data": {
  "label": "Arrow 05a Left-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 18.69,
   "image": "this.AnimatedImageResource_4E2596E4_5310_9C24_41C4_D8D5DCCB299F",
   "pitch": -4.04,
   "yaw": 163.75,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_4860B7D4_531F_9C64_41C8_E50865EA87D1",
 "maps": [
  {
   "hfov": 18.69,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 163.75,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_1_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -4.04
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8, this.camera_750C8A44_7B0B_3759_4167_1CD08C0DB8C4); this.mainPlayList.set('selectedIndex', 11)"
  }
 ],
 "data": {
  "label": "Arrow 05a Left-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 30.81,
   "image": "this.AnimatedImageResource_22EDE837_53F1_9424_41C9_A3E67360EEE8",
   "pitch": -46.01,
   "yaw": -41.9,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_4D103EEE_5331_EC24_419A_08EC5B8063B5",
 "maps": [
  {
   "hfov": 30.81,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -41.9,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_370142F7_3D76_A913_41BF_C1C74ADAC03A_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -46.01
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E, this.camera_75E49DF4_7B0B_0D3A_41D8_F8C17DFE4ABD); this.mainPlayList.set('selectedIndex', 29)"
  }
 ],
 "data": {
  "label": "Arrow 04c"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 24.29,
   "image": "this.AnimatedImageResource_22DFB83F_53F1_9424_41BB_9CE3C2377023",
   "pitch": -10.62,
   "yaw": -78.55,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_6C9A74C2_5371_9C5C_41B0_393C518DD355",
 "maps": [
  {
   "hfov": 24.29,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -78.55,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 38,
      "height": 16
     }
    ]
   },
   "pitch": -10.62
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4, this.camera_740EEB2A_7B0B_352E_41B2_7AE02A85BC36); this.mainPlayList.set('selectedIndex', 35)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 20.48,
   "image": "this.AnimatedImageResource_22D68848_53F1_946C_41A1_ABA5E6435B8E",
   "pitch": -12.06,
   "yaw": 87.65,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1AC888E4_5371_7424_41D4_99DCB19E4ADA",
 "maps": [
  {
   "hfov": 20.48,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 87.65,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -12.06
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8, this.camera_741EFB3C_7B0B_352A_41D3_F8E4AC2E2512); this.mainPlayList.set('selectedIndex', 37)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 25.14,
   "image": "this.AnimatedImageResource_22D62849_53F1_946C_4196_D14300DAD952",
   "pitch": -7.1,
   "yaw": -103.84,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1AC7C23E_5373_9424_416B_3123BA8F2FD1",
 "maps": [
  {
   "hfov": 25.14,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -103.84,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -7.1
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D, this.camera_6BEEEFFE_7B0B_0D29_41C2_B2DEBC62C90E); this.mainPlayList.set('selectedIndex', 54)"
  }
 ],
 "data": {
  "label": "Arrow 08a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 20.88,
   "image": "this.AnimatedImageResource_496D52EF_6B82_387E_41B6_A35323ADAFC7",
   "pitch": -22.75,
   "yaw": 76.56,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_64059F0F_6B82_09BD_41C5_9839B8EBA5AE",
 "maps": [
  {
   "hfov": 20.88,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 76.56,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_41B59243_52F1_745C_41D2_0F074F5B396F_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -22.75
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820, this.camera_6B31AF2F_7B0B_0D27_4187_B35CB13A95CC); this.mainPlayList.set('selectedIndex', 9)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 19.93,
   "image": "this.AnimatedImageResource_22E95836_53F1_9424_41AA_A244CE8D338B",
   "pitch": -12.32,
   "yaw": 8.38,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_48BD0607_5311_9FE4_41C5_6412DDC31075",
 "maps": [
  {
   "hfov": 19.93,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 8.38,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -12.32
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5, this.camera_6B41BF41_7B0B_0D5A_41D1_FDC37FFAD920); this.mainPlayList.set('selectedIndex', 10)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 22.84,
   "image": "this.AnimatedImageResource_22EEC836_53F1_9424_4199_2DA115E49C58",
   "pitch": -2.66,
   "yaw": 98.91,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_4F3DFF84_5310_ACE4_41CA_9B2F0282FD1B",
 "maps": [
  {
   "hfov": 22.84,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 98.91,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -2.66
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200, this.camera_6B534F54_7B0B_0D79_41D2_AF48C5EDBEE0); this.mainPlayList.set('selectedIndex', 4)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 21.25,
   "image": "this.AnimatedImageResource_22EE3836_53F1_9424_4182_00A042279A7E",
   "pitch": -8.61,
   "yaw": -102.4,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_4F2FD24F_5313_B464_41CE_EC031E39639B",
 "maps": [
  {
   "hfov": 21.25,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -102.4,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -8.61
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8, this.camera_74AB2E93_7B0B_0FFF_4174_B77A2BFB1123); this.mainPlayList.set('selectedIndex', 11)"
  }
 ],
 "data": {
  "label": "Arrow 04a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 22.09,
   "image": "this.AnimatedImageResource_22EFD836_53F1_9424_41D0_19CEA13393BC",
   "pitch": -0.06,
   "yaw": -53.64,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_48F4A4B9_5311_9C2C_41C9_2D15FAD0B69F",
 "maps": [
  {
   "hfov": 22.09,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -53.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 22,
      "height": 16
     }
    ]
   },
   "pitch": -0.06
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279, this.camera_74C5CEB0_7B0B_0F39_41D8_AB2FBC67BB2F); this.mainPlayList.set('selectedIndex', 26)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 27.81,
   "image": "this.AnimatedImageResource_22EF5836_53F1_9424_41C0_7AAC4A1CF5E2",
   "pitch": 0.63,
   "yaw": 121.22,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_4E0E54AB_5311_7C2C_41D2_478C621DB325",
 "maps": [
  {
   "hfov": 27.81,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 121.22,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": 0.63
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D, this.camera_749B5E87_7B0B_0FE7_41C1_997F33D2B9F9); this.mainPlayList.set('selectedIndex', 8)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 21.65,
   "image": "this.AnimatedImageResource_22ECC837_53F1_9424_41CE_87E09C04E763",
   "pitch": -6.02,
   "yaw": -158.27,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_4E65F22A_5310_942F_41A2_FDDCE668BF3A",
 "maps": [
  {
   "hfov": 21.65,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -158.27,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -6.02
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543, this.camera_74B56EA3_7B0B_0FDF_419E_B8BD669339A9); this.mainPlayList.set('selectedIndex', 13)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 19.84,
   "image": "this.AnimatedImageResource_494F02CD_6B82_38BD_41C1_89BC2E28D155",
   "pitch": 1.05,
   "yaw": 39.95,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_0F810A4B_53F0_B46C_41CE_EAB8D89B8C69",
 "maps": [
  {
   "hfov": 19.84,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 39.95,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0_HS_3_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": 1.05
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28, this.camera_758B1D9C_7B0B_0DEA_41B2_203E4C0B8069); this.mainPlayList.set('selectedIndex', 51)"
  }
 ],
 "data": {
  "label": "Arrow 05a Left-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 23.17,
   "image": "this.AnimatedImageResource_22D8383D_53F1_9424_41C5_AC286C127F7D",
   "pitch": -21.48,
   "yaw": -38.58,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_60212AF3_5311_F43C_41A9_DE6045FFC037",
 "maps": [
  {
   "hfov": 23.17,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -38.58,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -21.48
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026, this.camera_75956DA9_7B0B_0D2A_41CE_2D1A25168BA6); this.mainPlayList.set('selectedIndex', 50)"
  }
 ],
 "data": {
  "label": "Arrow 04a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 16.33,
   "image": "this.AnimatedImageResource_22D9C83E_53F1_9424_41BC_F36E2984B487",
   "pitch": -14.54,
   "yaw": 65.1,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_67A36BBD_5310_9425_41CD_E0A29FE650F0",
 "maps": [
  {
   "hfov": 16.33,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 65.1,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 22,
      "height": 16
     }
    ]
   },
   "pitch": -14.54
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5, this.camera_6BBF0FD2_7B0B_0D79_41B3_A9BEAEF1DEB4); this.mainPlayList.set('selectedIndex', 10)"
  }
 ],
 "data": {
  "label": "Arrow 06a"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 21.35,
   "image": "this.AnimatedImageResource_22D9583E_53F1_9424_41AE_1E99F8056A4C",
   "pitch": -19.06,
   "yaw": -160.74,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_72FCBA61_5331_745C_41C2_A05DABD8DEE2",
 "maps": [
  {
   "hfov": 21.35,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -160.74,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -19.06
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9, this.camera_755FED69_7B0B_0D2B_41DD_21F3436A7635); this.mainPlayList.set('selectedIndex', 45)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 16.67,
   "image": "this.AnimatedImageResource_4973A2EC_6B82_3863_41A1_C074705AB38C",
   "pitch": -19.2,
   "yaw": 171.12,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_70F9F675_6B8E_386D_41B3_B1EF7547BA87",
 "maps": [
  {
   "hfov": 16.67,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 171.12,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -19.2
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8, this.camera_76F8DCE9_7B0B_332B_41BB_A5A16B61F0BC); this.mainPlayList.set('selectedIndex', 32)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.47,
   "image": "this.AnimatedImageResource_22D09847_53F1_9464_41C5_7F7D1B4E30E8",
   "pitch": -8.22,
   "yaw": 101.31,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_16D1B185_5370_94E4_41B5_7E96768D3381",
 "maps": [
  {
   "hfov": 17.47,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 101.31,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -8.22
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4, this.camera_76F71CDC_7B0B_336A_41DA_9A3AC5A3809F); this.mainPlayList.set('selectedIndex', 35)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 20.37,
   "image": "this.AnimatedImageResource_22D01848_53F1_946C_41BC_ED7C29BAB4C0",
   "pitch": -2.71,
   "yaw": -103.36,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1A90069E_5377_7CE4_41CF_A1B69F54CA43",
 "maps": [
  {
   "hfov": 20.37,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -103.36,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -2.71
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8, this.camera_6A4A204B_7B0B_136F_41C1_A7B8832245F6); this.mainPlayList.set('selectedIndex', 33)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.2,
   "image": "this.AnimatedImageResource_22DD6846_53F1_9464_41A4_93553126A9BC",
   "pitch": -13.02,
   "yaw": 41.19,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_10A2B99B_5370_F4EC_41D3_2E4CBE2560B1",
 "maps": [
  {
   "hfov": 17.2,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 41.19,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -13.02
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C, this.camera_6A3B103D_7B0B_132A_41B1_4CC5D17548DA); this.mainPlayList.set('selectedIndex', 31)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.14,
   "image": "this.AnimatedImageResource_22D2F847_53F1_9464_41D0_7BD915B639D8",
   "pitch": -13.85,
   "yaw": 142.91,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_173809B0_5373_943B_41D1_B86E169D8DB8",
 "maps": [
  {
   "hfov": 17.14,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 142.91,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -13.85
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_582FA100_52F1_B5DC_41C4_9454C21B9532, this.camera_6A5A0057_7B0B_1367_41C4_FF517603925E); this.mainPlayList.set('selectedIndex', 34)"
  }
 ],
 "data": {
  "label": "Arrow 05a Right-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 19.33,
   "image": "this.AnimatedImageResource_22D26847_53F1_9464_41C4_8AA002A3EF53",
   "pitch": -10.98,
   "yaw": -81.96,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_1BB73574_5370_9C24_41D0_3CA686E09302",
 "maps": [
  {
   "hfov": 19.33,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -81.96,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0_HS_2_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -10.98
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_582FA100_52F1_B5DC_41C4_9454C21B9532, this.camera_7502EA37_7B0B_3726_41DE_142FA827C2D7); this.mainPlayList.set('selectedIndex', 34)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.51,
   "image": "this.AnimatedImageResource_22D07848_53F1_946C_41BC_72A0034619D5",
   "pitch": -7.12,
   "yaw": 60.61,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_1BA0F675_5370_BC25_41D4_7C17500C84AB",
 "maps": [
  {
   "hfov": 17.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 60.61,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -7.12
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_5813582E_52F1_B424_41D1_D69A96FEC19E, this.camera_76F4AA2A_7B0B_372E_41BA_310FBE0E7073); this.mainPlayList.set('selectedIndex', 36)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 17.47,
   "image": "this.AnimatedImageResource_22D11848_53F1_946C_41CC_4EB8FCAF17A4",
   "pitch": -8.22,
   "yaw": -48.45,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_18FF449B_5371_BCEC_41D0_91EDA780594E",
 "maps": [
  {
   "hfov": 17.47,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -48.45,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -8.22
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.mainPlayList.set('selectedIndex', 18)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 15.78,
   "image": "this.AnimatedImageResource_4BCB0D3B_6B86_09E5_41D4_48496C983CF0",
   "pitch": -51.98,
   "yaw": -164.48,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_4BAD4236_6B82_7BEE_41C4_150005CF9581",
 "maps": [
  {
   "hfov": 15.78,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -164.48,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -51.98
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_37BDF644_3D7B_6976_41C0_850A6D00309F, this.camera_74F06C3E_7B0B_3326_41D2_F02150D1202C); this.mainPlayList.set('selectedIndex', 21)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 22.59,
   "image": "this.AnimatedImageResource_4BCB2D3B_6B86_09E5_41D9_0901D734CBBD",
   "pitch": -19.48,
   "yaw": -42.72,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_4AD98625_6B82_1BED_41D5_9D0A169CA565",
 "maps": [
  {
   "hfov": 22.59,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -42.72,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -19.48
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF, this.camera_6A2B1031_7B0B_133B_41D0_1F24413E6030); this.mainPlayList.set('selectedIndex', 42)"
  }
 ],
 "data": {
  "label": "Arrow 04b"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 24.51,
   "image": "this.AnimatedImageResource_22CAB84B_53F1_946C_41D2_B9CD5154E74E",
   "pitch": -1.08,
   "yaw": 3.64,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 100
  }
 ],
 "id": "overlay_03177CC9_53EF_6C6C_41BE_84DDEF583438",
 "maps": [
  {
   "hfov": 24.51,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": 3.64,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_0_HS_0_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 27,
      "height": 16
     }
    ]
   },
   "pitch": -1.08
  }
 ]
},
{
 "enabledInCardboard": true,
 "class": "HotspotPanoramaOverlay",
 "rollOverDisplay": false,
 "areas": [
  {
   "class": "HotspotPanoramaOverlayArea",
   "mapColor": "#FF0000",
   "click": "this.startPanoramaWithCamera(this.panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2, this.camera_6A19B024_7B0B_12D9_41DB_AA74C027F936); this.mainPlayList.set('selectedIndex', 39)"
  }
 ],
 "data": {
  "label": "Arrow 05a Left-Up"
 },
 "useHandCursor": true,
 "items": [
  {
   "hfov": 19.34,
   "image": "this.AnimatedImageResource_22CA384B_53F1_946C_41B7_CE1CF49CB84D",
   "pitch": -10.77,
   "yaw": -151.49,
   "class": "HotspotPanoramaOverlayImage",
   "distance": 50
  }
 ],
 "id": "overlay_009931EC_53EF_742B_41BF_F7AC1EAE1C46",
 "maps": [
  {
   "hfov": 19.34,
   "class": "HotspotPanoramaOverlayMap",
   "yaw": -151.49,
   "image": {
    "class": "ImageResource",
    "levels": [
     {
      "url": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_0_HS_1_0_0_map.gif",
      "class": "ImageResourceLevel",
      "width": 24,
      "height": 16
     }
    ]
   },
   "pitch": -10.77
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_497032EC_6B82_3863_41D6_CCB34FAA2965",
 "levels": [
  {
   "url": "media/panorama_582E0176_52F1_9424_41BA_C3003357DF6B_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 510
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_4E2266E3_5310_9C5C_41D4_02A7E42103EC",
 "levels": [
  {
   "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_4E2226E4_5310_9C24_41C9_353ABE088A5E",
 "levels": [
  {
   "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_4E2296E4_5310_9C24_41A0_DD2AE87404F4",
 "levels": [
  {
   "url": "media/panorama_37B9E2C4_3D7A_A975_41BA_F7C49D4BF200_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 300
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E9C834_53F1_9424_41A2_155D00846DE6",
 "levels": [
  {
   "url": "media/panorama_37B92976_3D7A_BB15_41BB_2C6647A9912F_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E5B83C_53F1_9424_41B5_B285585252BF",
 "levels": [
  {
   "url": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E5483C_53F1_9424_41CE_019087C227F1",
 "levels": [
  {
   "url": "media/panorama_37BD69A0_3D7B_9B2D_41B2_469619BB4408_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22C6B858_53F1_946C_41D4_861EB72AFA83",
 "levels": [
  {
   "url": "media/panorama_69D7F613_5310_9FFC_41C6_DA5118062FEE_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 300
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_496A82F0_6B82_3862_41B7_22998D2208E6",
 "levels": [
  {
   "url": "media/panorama_67858E59_6B82_0BA5_41D5_AC83F0585418_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E6383A_53F1_942C_41C0_1E815F523D51",
 "levels": [
  {
   "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E7983A_53F1_942C_41B2_A2BCE4061B00",
 "levels": [
  {
   "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E1783A_53F1_942C_41A7_2630388B5092",
 "levels": [
  {
   "url": "media/panorama_37BEBC0B_3D7B_78F3_41CE_2899C64ED4FB_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E7083B_53F1_942C_41D3_3C3F498FE847",
 "levels": [
  {
   "url": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 300
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E7783B_53F1_942C_4189_0501E2EC810E",
 "levels": [
  {
   "url": "media/panorama_37BC42DC_3D7B_6916_41C7_05F9C7416301_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_4E23C6E3_5310_9C5C_41CE_07156EC19915",
 "levels": [
  {
   "url": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_4E2386E3_5310_9C5C_41D3_6D76C287D1AB",
 "levels": [
  {
   "url": "media/panorama_37BC9F65_3D7A_9737_41BC_E59F2F2A77E1_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22EA082E_53F1_9424_41D3_3F8200659F95",
 "levels": [
  {
   "url": "media/panorama_37B158A5_3D7A_9937_41A9_E252B459A742_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D30847_53F1_9464_41B1_33CCD496F7E4",
 "levels": [
  {
   "url": "media/panorama_5810FD4A_52F1_AC6C_41C7_5E6014EA75C8_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22C18852_53F1_947C_41C8_7D4089014E68",
 "levels": [
  {
   "url": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22C11853_53F1_947C_419E_1B1009C139E0",
 "levels": [
  {
   "url": "media/panorama_41B3DEB4_52F1_6C24_41D2_C51330D8871D_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22CBB84B_53F1_946C_41BA_B28F03DDF0AF",
 "levels": [
  {
   "url": "media/panorama_582F47D2_52F1_9C7C_41D2_570A5FB51CD4_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 300
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22DEB83E_53F1_9424_416C_6EAA7E6106B8",
 "levels": [
  {
   "url": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22DE283E_53F1_9424_41D3_A5386DD73462",
 "levels": [
  {
   "url": "media/panorama_5828C73D_52F1_7C24_41B2_772074CC709A_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 510
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E18839_53F1_942C_41CA_6EF67E31A5F9",
 "levels": [
  {
   "url": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E1E839_53F1_942C_41C1_C7C33FAD0317",
 "levels": [
  {
   "url": "media/panorama_37BD7518_3D7B_6B1E_41BA_03C4C1736060_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 300
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22DC7846_53F1_9464_41BE_ECEB483A390F",
 "levels": [
  {
   "url": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22DDE846_53F1_9464_41C1_88A7B4F5C713",
 "levels": [
  {
   "url": "media/panorama_5816B52D_52F1_9C24_41B7_BF3F0727AC6C_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 300
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22DA983C_53F1_9424_4196_67643D82B8FD",
 "levels": [
  {
   "url": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22DA183C_53F1_9424_41D4_B1C40E64F495",
 "levels": [
  {
   "url": "media/panorama_37BC8D02_3D7B_98ED_41B8_677794412AAA_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D7C849_53F1_946C_41AA_38242BA33E76",
 "levels": [
  {
   "url": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 520,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D75849_53F1_946C_41C8_53942580BDEB",
 "levels": [
  {
   "url": "media/panorama_5811FBEB_52F1_B42C_41C4_BB92EC49EDB8_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22CE084F_53F1_9465_41AB_FA5CC56B75DB",
 "levels": [
  {
   "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22CFB84F_53F1_9465_41D2_5DECB39F3EB6",
 "levels": [
  {
   "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22CF484F_53F1_9465_41C6_64E86EFF0F06",
 "levels": [
  {
   "url": "media/panorama_5813CAA4_52F1_F424_41C8_BCB3915037C9_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22C3B851_53F1_947C_4193_E6BDE252F510",
 "levels": [
  {
   "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22C35852_53F1_947C_41C5_B910B00034B2",
 "levels": [
  {
   "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22C0F852_53F1_947C_41D3_3B865BCC2AB0",
 "levels": [
  {
   "url": "media/panorama_41B17B3C_52F0_9424_41A1_390023C55BE4_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22CCE850_53F1_947C_41D2_F98DDC691705",
 "levels": [
  {
   "url": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22CD9850_53F1_947C_41D1_ACB645D198C3",
 "levels": [
  {
   "url": "media/panorama_41466A8D_52F0_B4E4_41BD_99BC9A08B026_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22EC1837_53F1_9424_41D2_CA15B9717E09",
 "levels": [
  {
   "url": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22ED8837_53F1_9424_41BF_5483CBE372B7",
 "levels": [
  {
   "url": "media/panorama_37B80A43_3D7A_9973_41C1_F0E6E6075ED8_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22ED4837_53F1_9424_419B_BE7B371291E5",
 "levels": [
  {
   "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E29837_53F1_9424_41C2_C86E762AD72B",
 "levels": [
  {
   "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 510
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E21838_53F1_942C_41BC_25D9704C7EF5",
 "levels": [
  {
   "url": "media/panorama_37BB4E0F_3D7A_98F3_41CD_7FB0EF961543_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22C9E84E_53F1_9467_41D2_BCCE34007D6D",
 "levels": [
  {
   "url": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22C9784E_53F1_9467_41D3_BD092B776D85",
 "levels": [
  {
   "url": "media/panorama_5812C72A_52F1_FC2C_419A_E5AA20D7A4C3_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22C8E84D_53F1_9465_41A3_C3C251DA1890",
 "levels": [
  {
   "url": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22C8684E_53F1_9467_4184_DD24789E6970",
 "levels": [
  {
   "url": "media/panorama_58121349_52F1_F46C_41C1_961015C5B031_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22CD0850_53F1_947C_41D2_6B56D02D0A6F",
 "levels": [
  {
   "url": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22C28851_53F1_947C_41C6_94B4F01263B0",
 "levels": [
  {
   "url": "media/panorama_41B0B3DD_52F0_9467_419E_22ABA0498D28_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22CBD84D_53F1_9465_41C4_E37E1D87FCCE",
 "levels": [
  {
   "url": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22CB484D_53F1_9465_4171_38C8B07E0C18",
 "levels": [
  {
   "url": "media/panorama_582D1FB5_52F1_EC24_41D1_E092EA4BEDBF_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22DF7840_53F1_945C_41CF_7F6AF574D2D3",
 "levels": [
  {
   "url": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22DCF845_53F1_9464_41A3_186795D7C7D3",
 "levels": [
  {
   "url": "media/panorama_5811D1A0_52F1_94DC_41C6_101784DB1B5F_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_4E20B6E3_5310_9C5C_41D0_E306EED8AC80",
 "levels": [
  {
   "url": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_4E2366E3_5310_9C5C_4167_A7416239448E",
 "levels": [
  {
   "url": "media/panorama_37B9CC01_3D7A_98EF_41CA_6DD6DAE6EB52_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 640,
   "height": 780
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22C21851_53F1_947C_41C3_F86D904681DE",
 "levels": [
  {
   "url": "media/panorama_41B337C8_52F0_9C6C_41D2_379C50EAB968_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 300
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_496B02F0_6B82_3862_41C7_B3C75E2E565B",
 "levels": [
  {
   "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 360
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_496BB2F0_6B82_3862_41D3_2F4F5466D538",
 "levels": [
  {
   "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_496812F1_6B82_3862_41C6_315450D90F39",
 "levels": [
  {
   "url": "media/panorama_7E7BC6B3_6B86_18E5_41C0_07A1FE80A244_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 720,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E4D83C_53F1_9424_41D1_CEA021E00C12",
 "levels": [
  {
   "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 300
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E4483C_53F1_9424_41D1_1CB54C700BDF",
 "levels": [
  {
   "url": "media/panorama_37BDF644_3D7B_6976_41C0_850A6D00309F_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22DB983D_53F1_9424_41AC_2E0EDBC8CD24",
 "levels": [
  {
   "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 510
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22DB183D_53F1_9424_41CA_CEB085504B8B",
 "levels": [
  {
   "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D8983D_53F1_9424_41A4_8A5AD9D0FF10",
 "levels": [
  {
   "url": "media/panorama_37BE90F1_3D7B_A92F_41CC_A3522400A4E2_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 300
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22CAA84A_53F1_946C_4193_35F0C0165F45",
 "levels": [
  {
   "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22CA184B_53F1_946C_41C3_D53F1E0C44F0",
 "levels": [
  {
   "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_48116637_6B82_FBED_41B3_2CB8F9BB9E9F",
 "levels": [
  {
   "url": "media/panorama_582C43C2_52F1_945C_41D2_FBF4F89D38D2_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E38838_53F1_942C_41CC_B3E15BC0E5C3",
 "levels": [
  {
   "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E3C838_53F1_942C_41C9_0457EB10D0F5",
 "levels": [
  {
   "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E34838_53F1_942C_41BC_A3B46B2A3DCD",
 "levels": [
  {
   "url": "media/panorama_58134031_52F1_B43C_41C6_897208B5BB0E_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E14839_53F1_942C_41A8_DD55E3DFAB54",
 "levels": [
  {
   "url": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E6B839_53F1_942C_41C2_93E139E32180",
 "levels": [
  {
   "url": "media/panorama_37BFC891_3D7B_79EF_41CC_225FF205D876_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E0B839_53F1_942C_41D2_9614D885CE40",
 "levels": [
  {
   "url": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E01839_53F1_942C_41A7_E830946FE10C",
 "levels": [
  {
   "url": "media/panorama_594DA097_52F7_94E4_41C5_224F3338F6CC_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E6D83A_53F1_942C_418F_966AB46DA474",
 "levels": [
  {
   "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E6383B_53F1_942C_41C4_F0883C608DA1",
 "levels": [
  {
   "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E7983B_53F1_942C_41B0_495FD3299B6B",
 "levels": [
  {
   "url": "media/panorama_37BFAF6F_3D7B_7733_41A5_54D0D5BA6E31_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22DF383F_53F1_9424_419F_4F686704683B",
 "levels": [
  {
   "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22DCB83F_53F1_9424_41C5_A69FF89CBC67",
 "levels": [
  {
   "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22DCF83F_53F1_9424_417B_78043CAD8867",
 "levels": [
  {
   "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22DC683F_53F1_9424_41D1_EA5822C93B7D",
 "levels": [
  {
   "url": "media/panorama_5813AE2A_52F1_6C2C_41CF_CBD2DB69F37E_0_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22EF8836_53F1_9424_41D2_DC13E298F182",
 "levels": [
  {
   "url": "media/panorama_37BCA39D_3D7A_AF17_41CE_3C32A7665820_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E91834_53F1_9424_41D2_FCD94F9DA203",
 "levels": [
  {
   "url": "media/panorama_37BA7CDC_3D7A_B915_4193_00FE0D7895F8_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 520,
   "height": 360
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D4C84A_53F1_946C_419F_EF14B747B3A4",
 "levels": [
  {
   "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D4584A_53F1_946C_41C4_FD2DCA567CB3",
 "levels": [
  {
   "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 720,
   "height": 300
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D5B84A_53F1_946C_41CA_D23692535547",
 "levels": [
  {
   "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D5084A_53F1_946C_41B6_EE4A7D1EF05D",
 "levels": [
  {
   "url": "media/panorama_5816F016_52F1_93E4_41C3_D978FA13AD04_0_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 300
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_4E2566E4_5310_9C24_41C6_12EF009F11BE",
 "levels": [
  {
   "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_1_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 460,
   "height": 360
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_4E25C6E4_5310_9C24_41D0_D51BC953650A",
 "levels": [
  {
   "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_1_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 300
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_4E2596E4_5310_9C24_41C4_D8D5DCCB299F",
 "levels": [
  {
   "url": "media/panorama_37BAF624_3D7A_A935_41C5_66C6A616D8EE_1_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22EDE837_53F1_9424_41C9_A3E67360EEE8",
 "levels": [
  {
   "url": "media/panorama_370142F7_3D76_A913_41BF_C1C74ADAC03A_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22DFB83F_53F1_9424_41BB_9CE3C2377023",
 "levels": [
  {
   "url": "media/panorama_58130AB5_52F1_7424_41D3_5CCB0227C18E_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 300
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D68848_53F1_946C_41A1_ABA5E6435B8E",
 "levels": [
  {
   "url": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D62849_53F1_946C_4196_D14300DAD952",
 "levels": [
  {
   "url": "media/panorama_5813582E_52F1_B424_41D1_D69A96FEC19E_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 7,
 "frameCount": 32,
 "frameDuration": 41,
 "colCount": 5,
 "id": "AnimatedImageResource_496D52EF_6B82_387E_41B6_A35323ADAFC7",
 "levels": [
  {
   "url": "media/panorama_41B59243_52F1_745C_41D2_0F074F5B396F_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 600,
   "height": 560
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22E95836_53F1_9424_41AA_A244CE8D338B",
 "levels": [
  {
   "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22EEC836_53F1_9424_4199_2DA115E49C58",
 "levels": [
  {
   "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22EE3836_53F1_9424_4182_00A042279A7E",
 "levels": [
  {
   "url": "media/panorama_37BAA03C_3D7A_A915_41A8_96446DDDB50D_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22EFD836_53F1_9424_41D0_19CEA13393BC",
 "levels": [
  {
   "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 510
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22EF5836_53F1_9424_41C0_7AAC4A1CF5E2",
 "levels": [
  {
   "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22ECC837_53F1_9424_41CE_87E09C04E763",
 "levels": [
  {
   "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_494F02CD_6B82_38BD_41C1_89BC2E28D155",
 "levels": [
  {
   "url": "media/panorama_37BB96F9_3D7A_A91F_41C7_4EE0AAAE6BE5_0_HS_3_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D8383D_53F1_9424_41C5_AC286C127F7D",
 "levels": [
  {
   "url": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D9C83E_53F1_9424_41BC_F36E2984B487",
 "levels": [
  {
   "url": "media/panorama_37BF345B_3D7B_A913_418C_0BA72EB00126_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 510
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D9583E_53F1_9424_41AE_1E99F8056A4C",
 "levels": [
  {
   "url": "media/panorama_5ED48320_52F1_75DC_41C1_C2DBB1A03279_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_4973A2EC_6B82_3863_41A1_C074705AB38C",
 "levels": [
  {
   "url": "media/panorama_582DCE1D_52F1_EFE4_41AE_D3A1C07AEB7A_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D09847_53F1_9464_41C5_7F7D1B4E30E8",
 "levels": [
  {
   "url": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D01848_53F1_946C_41BC_ED7C29BAB4C0",
 "levels": [
  {
   "url": "media/panorama_582FA100_52F1_B5DC_41C4_9454C21B9532_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22DD6846_53F1_9464_41A4_93553126A9BC",
 "levels": [
  {
   "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D2F847_53F1_9464_41D0_7BD915B639D8",
 "levels": [
  {
   "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D26847_53F1_9464_41C4_8AA002A3EF53",
 "levels": [
  {
   "url": "media/panorama_58172962_52F1_945C_41C5_35C2AEEA9EC8_0_HS_2_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D07848_53F1_946C_41BC_72A0034619D5",
 "levels": [
  {
   "url": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22D11848_53F1_946C_41CC_4EB8FCAF17A4",
 "levels": [
  {
   "url": "media/panorama_5811B48A_52F1_BCEC_4194_D7982EA466B4_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_4BCB0D3B_6B86_09E5_41D4_48496C983CF0",
 "levels": [
  {
   "url": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_4BCB2D3B_6B86_09E5_41D9_0901D734CBBD",
 "levels": [
  {
   "url": "media/panorama_5810090E_52F1_95E4_41D0_057739B73120_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 21,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22CAB84B_53F1_946C_41D2_B9CD5154E74E",
 "levels": [
  {
   "url": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_0_HS_0_0.png",
   "class": "ImageResourceLevel",
   "width": 480,
   "height": 420
  }
 ]
},
{
 "class": "AnimatedImageResource",
 "rowCount": 6,
 "frameCount": 24,
 "frameDuration": 41,
 "colCount": 4,
 "id": "AnimatedImageResource_22CA384B_53F1_946C_41B7_CE1CF49CB84D",
 "levels": [
  {
   "url": "media/panorama_582F6C03_52F1_93DC_41A1_3D68BA81DA56_0_HS_1_0.png",
   "class": "ImageResourceLevel",
   "width": 560,
   "height": 540
  }
 ]
}],
 "width": "100%",
 "propagateClick": false
};

    
    function HistoryData(playList) {
        this.playList = playList;
        this.list = [];
        this.pointer = -1;
    }

    HistoryData.prototype.add = function(index){
        if(this.pointer < this.list.length && this.list[this.pointer] == index) {
            return;
        }
        ++this.pointer;
        this.list.splice(this.pointer, this.list.length - this.pointer, index);
    };

    HistoryData.prototype.back = function(){
        if(!this.canBack()) return;
        this.playList.set('selectedIndex', this.list[--this.pointer]);
    };

    HistoryData.prototype.forward = function(){
        if(!this.canForward()) return;
        this.playList.set('selectedIndex', this.list[++this.pointer]);
    };

    HistoryData.prototype.canBack = function(){
        return this.pointer > 0;
    };

    HistoryData.prototype.canForward = function(){
        return this.pointer >= 0 && this.pointer < this.list.length-1;
    };
    //

    if(script.data == undefined)
        script.data = {};
    script.data["history"] = {};    //playListID -> HistoryData

    TDV.PlayerAPI.defineScript(script);
})();
