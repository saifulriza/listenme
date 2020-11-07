<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png" /> -->
    <input type="file" @change="submit($event, index)" accept="audio/mpeg" />
    <div class="container">
      <div v-for="(hasil, index) in hasil" :key="index">
        <div v-if="hasil.results">
          <div v-for="(kata, index) in hasil.results" :key="index">
            <div v-for="(finalKata, index) in kata.alternatives" :key="index">
              <div v-if="kata.final">
                {{ finalKata.transcript }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, onBeforeMount } from "vue";
import WebSocketAsPromised from "websocket-as-promised";
import generateToken from "watson-token";
export let hasil = ref([]);
var token = ref("  ");

// setTimeout(() => {
//   console.log(token.value);
// }, 5000);

function sendStop() {
  const stop = { action: "stop" };
  wsp.send(JSON.stringify(stop));
}

async function sendHeader() {
  const header = {
    timestamps: true,
    "content-type": "audio/mpeg",
    interim_results: true,
    keywords: [
      "IBM",
      "admired",
      "AI",
      "transformations",
      "cognitive",
      "Artificial Intelligence",
      "data",
      "predict",
      "learn",
    ],
    keywords_threshold: 0.01,
    word_alternatives_threshold: 0.01,
    smart_formatting: true,
    speaker_labels: false,
    action: "start",
  };

  wsp.send(JSON.stringify(header));
}

var url;
var wsp;
onMounted(() => {
  generateToken(
    "proxy-watson.herokuapp.com",
    "/identity/token",
    "80",
    "iGjNmBnh6rTw4P5EEk_5rYchhsQgtILxaJY0GAZk5Loo",
    (response) => {
      token.value = response;
      // console.log(token.value);
      url = `wss://api.us-south.speech-to-text.watson.cloud.ibm.com/instances/788fdc16-811d-4d74-8baf-8026957fe1e4/v1/recognize?inactivity_timeout=-1&model=en-US_BroadbandModel&access_token=${token.value}`;

      wsp = new WebSocketAsPromised(url);
    }
  );
});

function getResponse(mt) {
  return new Promise((resolve, reject) => {
    wsp.onMessage.addListener((message) => {
      let resp = JSON.parse(message);
      if (mt == resp.state) {
        wsp.removeAllListeners();
        resolve(message);
      } else {
        wsp.removeAllListeners();
        reject();
      }
    });
  });
}

function getResponsePesan() {
  return new Promise((resolve, reject) => {
    wsp.onMessage.addListener((message) => {
      let resp = JSON.parse(message);
      hasil.value.push(resp);
    });
  });
}

const openWebSocket = async function(blob) {
  await wsp.open();
  await sendHeader();
  const respon = JSON.parse(await getResponse("listening"));

  await blob.forEach((blob, index, arr) => {
    setTimeout(function() {
      wsp.send(blob);
    }, 500 * (index + 1));
  });
  setTimeout(function() {
    sendStop();
  }, 500 * (blob.length + 1));
  const responPesan = JSON.parse(await getResponsePesan());
};

export const submit = (evt, index) => {
  var chunksAmount;
  var blob;
  hasil.value = [];

  const reader = new FileReader();
  reader.onload = function(e) {
    blob = new Blob([new Uint8Array(e.target.result)], { type: "audio/mpeg" });
    if (blob.size < 100000) {
      chunksAmount = 5;
    } else if (blob.size >= 100000 && blob.size < 1000000) {
      chunksAmount = 10;
    } else if (blob.size >= 1000000 && blob.size < 10000000) {
      chunksAmount = 100;
    } else if (blob.size >= 10000000 && blob.size < 100000000) {
      chunksAmount = 1000;
    } else if (blob.size >= 100000000 && blob.size < 1000000000) {
      chunksAmount = 10000;
    } else if (blob.size >= 1000000000 && blob.size < 10000000000) {
      chunksAmount = 100000;
    } else if (blob.size >= 10000000000 && blob.size < 100000000000) {
      chunksAmount = 1000000;
    } else if (blob.size >= 100000000000 && blob.size < 1000000000000) {
      chunksAmount = 10000000;
    } else if (blob.size >= 1000000000000 && blob.size < 10000000000000) {
      chunksAmount = 100000000;
    } else if (blob.size >= 10000000000000 && blob.size < 100000000000000) {
      chunksAmount = 1000000000;
    } else if (blob.size >= 100000000000000 && blob.size < 1000000000000000) {
      chunksAmount = 10000000000;
    } else if (blob.size >= 1000000000000000 && blob.size < 10000000000000000) {
      chunksAmount = 100000000000;
    } else if (blob.size >= 10000000000000000) {
      throw "blob terlalu besar";
    }

    var byteIndex = 0;
    var chunks = [];
    var contentType = file.type;

    for (var i = 0; i < chunksAmount; i += 1) {
      var byteEnd = Math.ceil((blob.size / chunksAmount) * (i + 1));
      chunks.push(blob.slice(byteIndex, byteEnd, contentType));
      byteIndex += byteEnd - byteIndex;
    }
    openWebSocket(chunks);
  };
  const file = evt.target.files[0];
  reader.readAsArrayBuffer(file);

  reader.onloadend = function() {};
};

// console.log("aaaa", a);
</script>

<style>
.container {
  padding: 0.4em;
  margin: 2em;
  width: 90%;
  border-radius: 50px;
  background: linear-gradient(145deg, #4da7db, #5bc6ff);
  box-shadow: 20px 20px 60px #489dcf, -20px -20px 60px #62d5ff;
}
html {
  display: flex;
  justify-content: center;
  background-color: #55b9f3;
}
</style>
