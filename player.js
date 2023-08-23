class Util {
  /**
   * Fetches the response from the URL. If offline, it will attempt to wait for up to `max_attempts=10` tries, 1 minutes each, for the connection to go back online.
   * @param url <String> the url to get.
   * @param max_attempts <int> the number of times to attempt before aborting.
   * @throws Exceptions that are raised while fetching the url (not including NetworkErrors), or an offline timeout error.
   */
  async get_successful_fetch(url, max_attempts = 10) {
    function delay_until_connection(timeout_sec) {
      // Sleep until onLine or timeout.
      let end_at = Date.now() + timeout_sec * 1000;
      while (!window.navigator.onLine) {
        if (Date.now() >= end_at) {
          throw "Timeout exception, offline for too long!";
        }
      }
    }
    var attempt = 0;
    let result = null;
    while (result == null && attempt++ < max_attempts) {
      try {
        return await fetch(url);
      } catch (err) {
        if (!err.message.startswith("NetworkError")) {
          throw err;
        }
        // else it is a network error, so keep waiting until we timeout in 60 seconds
        Logger.log(`get_successful_fetch(${url}); //Offline... waiting to reconnect...`,65);
        await delay_until_connection(60);
      }
    }
    throw `Timed out trying to get ${url}`;
  }

  /**
   * Extracts json from a successful fetch.
   * @param url <String> The url to extract JSON from.
   * @returns result of JSON.parse.
   */
  async get_JSON(url) {
    Logger.log(`get_JSON(${url})`,10);
    let response = await get_successful_fetch(url);
    let data = await response.json();
    Logger.log(data,10);
    return data;
  }
  /**
   * @param sec <number> seconds.
   * @returns <String> simplified timestamp.
   */
  sec_to_human_readable_timestamp(sec) {return `${String(parseInt(sec / 3600)).padStart(2, "0")}:${String(parseInt((sec % 3600) / 60)).padStart(2, "0")}:${parseInt(sec) % 60}`;}
  /**
   * @returns true if on mobile device, false otherwise.
   */
  mobileCheck() {
    return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(navigator.userAgent || navigator.vendor || window.opera) ||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent || navigator?.vendor || window.opera).substr(0, 4)));
  }
}

class Logger {
  /**
   * Writes data to the log table at the bottom of the page
   * @param {*} val the value to write
   * @param {Number} timeout the seconds before the log message is destroyed, <=0 for no distruction.
   */
  log(val, timeout = 0) {
    console.log(val);
    var ts = document.createTextNode(
      new Date().toLocaleTimeString("en-us", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        fractionalSecondDigits: 3,
      })
    );
    var is_secondary_val_type = false;
    if (String(val) == "[object Object]") {
      val = JSON.stringify(val);
      is_secondary_val_type = true; //JSON.parse(JSON.stringify(val)) == val;
    }
    val = document.createTextNode(val);
    var newRow = document.createElement("tr");
    newRow.appendChild(document.createElement("td")).appendChild(ts);
    newRow.appendChild(document.createElement("td")).appendChild(val);
    if (is_secondary_val_type) {
      newRow.childNodes[1].style.color = "red";
    }
    var tbl = document.querySelector("#log_table_body");
    tbl.appendChild(newRow);
    tbl.hidden = false;
    if (timeout > 0) {
      removeFadeOutAfter(newRow, Math.max(timeout, 1));
    }
  }

  /**
   * @param {HTMLElement} el the element to be dissapered
   * @param {*} seconds the seconds to dissapear after
   */
  async removeFadeOutAfter(el, seconds) {
    setTimeout(() => {
      el.style.transition = "opacity 1s ease";
      el.style.opacity = 0;
      setTimeout(function () {
        el.parentNode.removeChild(el);
      }, seconds * 1000);
    }, Math.max(seconds - 1, 1) * 1000);
  }
}

class Mixcloud {
  /**
   * @param key <String> the mixcloud key/url endpoint of the song to be retrieved.
   * @returns <String> the url for the audio source of the given mixcloud key.
   */
  static async retreive_audio_src(key) {
    write2log(`retreive_audio_src(${key})`);
    // Attempts to get the url for the src of the given mixcloud key
    var url = `https://justcors.com/l_n1ehx3zipc/https://www.dlmixcloud.com/ajax.php/?url=https://www.mixcloud.com${key}`;
    var response = await get_successful_fetch(url);
    var result_text = await response.text();
    var resulting_json = JSON.parse(result_text);
    var value = resulting_json["url"];
    write2log(null);
    return value;
  }

  /**
   * Fired when a src fails to load in the audio player.
   * Checks the playlist song records that use that src value and attepts to get the new updated SRC for them.
   * When successful it will update the src of the live PLAYLIST_SONG record.
   * This is a background thread!
   * @param src <str> the audio source string (url) to be checked for updates.
   */
  check_for_updated_src(src) {
    if (!src) {
      return null;
    }
    try {
      for (let e of PLAYLIST_SONGS) {
        if (e.src == src) {
          let ns = retreive_audio_src(e.key).then((newSrc) => {
            if (newSrc && e.src != newSrc) {
              e.src = newSrc;
              write2log(`Updated ${e.key} src to ${newSrc}!`);
              write2log(null);
            }
          });
        }
      }
    } catch (err) {
      write2log(
        `some ${err} error while attempting to get updated src of ${song.key}`
      );
    }
  }
}

/*class Player {
    constructor(serialized=null) {
        this.playbackOrder = serialized?.playbackOrder ? serialized.playbackOrder : 'shuffle';
        this.volume = serialized?.volume ? serialized.volume : 1;
        this.songs = ... what am i doing...
    }
}*/

/**
 * Updates the navagator.mediaSession object to reflect the given song.
 * this is buggy because of race conditions, will need to rethink this
 * /
function update_mediasession_info(song) {
  if ("mediaSession" in navigator) {
    try {
      var [artist, title] = song.name.split(": ", 2);
      navigator.mediaSession.metadata = new MediaMetadata({
        title: title,
        artist: artist,
        //album: "Podcast Name",
        //artwork: [{ src: "podcast.jpg" }],
      });
      var audio_element = document.querySelector("audio");
      navigator.mediaSession.setPositionState({
        duration: audio_element.duration,
        playbackRate: audio_element.playbackRate,
        position: audio_element.currentTime,
      });
    } catch (err) {}
  }
}
*/


/**
 * Updates the audio element with the given src url.
 * If successfully played, will update the persistent LAST_SONG_SRC value so that you can quick start playing next time the musicplayer is open.
 * @param src <str> the audio source string (url) to be played
 */
async function update_player_src(src) {
  if (src == null) {
    return;
  }
  var audio = document.querySelector("audio");
  var source = document.querySelector("source");
  source.setAttribute("src", src);
  try {
    audio.load();
    try {
      audio.play();
      audio.muted = false;
    } catch (err) {}
    update_persistent("LAST_SONG_SRC", src, 0); // save the src for the quickstart
  } catch (err) {}
}

class PersistentData {
  /**
   * Updates the given data as stringified JSON for the given key in the `localStorage`.
   * @param key <str> the localStorage key to update
   * @param data <?> the data.
   * @param mode <int>, -1=delete, 0=overwrite, 1=append (if [existing type is array, and mode == 1])
   */
  update(key, data = null, mode = 0) {
    if (key == null) {
      return key;
    }
    key = key.toString().startswith(window.location.pathname)
      ? key.toString()
      : `${window.location.pathname}.${key.toString()}`;
    if (mode in [-1, 0]) {
      localStorage.removeItem(key);
    }
    if (mode in [0, 1] && data != null) {
      var temp = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(temp)) {
        temp = temp.concat(data);
      } else {
        temp = data;
      }
      localStorage.setItem(key, JSON.stringify(temp));
    }
  }

  /**
   * @returns JSON.parse of the value stored at the `localStorage.key`.
   * null if it does not exist.
   * SECURITY NOTE: if attackers are able to override the values stored in the localstorage field, then they could possibly execute arbitrary code.
   */
  load(key) {
    if (key == null) {
      return key;
    }
    return JSON.parse(
      localStorage.getItem(
        key.toString().startswith(window.location.pathname)
          ? key.toString()
          : `${window.location.pathname}.${key.toString()}`
      )
    );
  }
}


class MediaSessionControls {
    static audio_element = null;
    static default_skip_time = 60;
    
    /**
     * Binds all the neccessary action handlers.
     */
    setup() {
        if (!MediaSessionControls.audio_element) {
            MediaSessionControls.audio_element = document.querySelector('audio');
        }
        if (!("mediaSession" in navigator)) {
        Logger.log(`No mediaSession in navigator?`,0);
        }
        const action_handlers = [
            ["play", MediaSessionControls.play],
            ["pause", MediaSessionControls.pause],
            ["stop",MediaSessionControls.stop],
            ["previoustrack",MediaSessionControls.previoustrack],
            ["nexttrack",MediaSessionControls.nexttrack],
            ["seekbackward",MediaSessionControls.seekbackward],
            ["seekforward",MediaSessionControls.seekforward],
            ["seekto",MediaSessionControls.seekto],
            // Not implemented: ['togglemicrophone', 'togglecamera', 'hangup', 'previousslide', and 'nextslide'];
        ];
        for (const [action, handler] of action_handlers) {
            try {
                navigator.mediaSession.setActionHandler(action, handler);
            } catch (error) {
                Logger.log(`ActionHandler ${action} failed to bind.`,0);
            }
        }
        try {
            // Set playback event listeners
            MediaSessionControls.audio_element.addEventListener("play", () => {navigator.mediaSession.playbackState = "playing";});
            MediaSessionControls.audio_element.addEventListener("pause", () => {navigator.mediaSession.playbackState = "paused";});
        } catch (err) {
            Logger.log(`Failed to set navigator.mediaSession.playbackState play/pause handlers`,0);
        }
    }
    
    // The action handler activities
    static play(){ Logger.log('play +'); MediaSessionControls.audio_element.play(); Logger.log('play -'); }
    static pause(){ Logger.log('pause +'); MediaSessionControls.audio_element.pause(); Logger.log('pause -'); }
    static stop(){ Logger.log('stop +'); MediaSessionControls.audio_element.pause(); Logger.log('stop -'); }
    static previoustrack(){ 
        Logger.log('previoustrack +');
        if (MediaSessionControls.audio_element.currentTime > 5) {
            audio_element.currentTime = 0
        } else {
            Logger.log('// TODO `previoustrack` needs to play previous!',0);
        }
        Logger.log('previoustrack -');
    }
    static nexttrack(){
        Logger.log('nexttrack +');
        Logger.log('// TODO `nexttrack` needs to go to next track!',0);
        Logger.log('nexttrack -');
    }
    static seekbackward(){
        Logger.log('seekbackward +');
        const skip_time = arguments.seekOffset || MediaSessionControls.default_skip_time;
        MediaSessionControls.audio_element?.currentTime = Math.max(MediaSessionControls.audio_element?.currentTime - skip_time,0);
        navigator.mediaSession.setPositionState({
            duration: MediaSessionControls.audio_element?.duration, 
            playbackRate: MediaSessionControls.audio_element?.playbackRate,
            position: MediaSessionControls.audio_element?.currentTime,
        });
        Logger.log('seekbackward -');
    }
    static seekforward(){
        Logger.log('seekforward +');
        const skip_time = arguments.seekOffset || MediaSessionControls.default_skip_time;
        MediaSessionControls.audio_element?.currentTime = Math.min(MediaSessionControls.audio_element?.currentTime + skip_time,0);
        navigator.mediaSession.setPositionState({
            duration: MediaSessionControls.audio_element?.duration,
            playbackRate: MediaSessionControls.audio_element?.playbackRate,
            position: MediaSessionControls.audio_element?.currentTime,
        });
        Logger.log('seekforward -');
    }
    static seekto(){
        Logger.log('seekto +');
        if (arguments.fastSeek && "fastSeek" in MediaSessionControls.audio_element) {
            MediaSessionControls.audio_element.fastSeek(arguments.seekTime);
        } else {
            MediaSessionControls.audio_element.currentTime = arguments.seekTime;
        }
        navigator.mediaSession.setPositionState({
            duration: MediaSessionControls.audio_element.duration,
            playbackRate: MediaSessionControls.audio_element.playbackRate,
            position: arguments.seekTime,
        });
        Logger.log('seekto +');
    }
    static togglemicrophone(){
        Logger.log('Not implemented: togglemicrophone');
    }
    static togglecamera(){
        Logger.log('Not implemented: togglecamera');
    }
    static hangup(){
        if (MediaSessionControls.audio_element?.currentTime > 0) {
            MediaSessionControls.audio_element.play(); 
        }
    }
    static previousslide(){
        Logger.log('Not implemented: previousslide');
    }
    static nextslide(){
        Logger.log('Not implemented: nextslide');
    }
}
/**
 * onload event:
 * 1. Loads any persistent data.
 * 2. Adds events to UI objects when they should become available.
 * 3. Retreives the playlists.
 * 4. Starts playing music.
 */
window.onload = async function () {};
