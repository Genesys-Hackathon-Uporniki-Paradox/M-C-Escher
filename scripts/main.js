/*
 *  JS goes here
 */

window.SpeechRecognition = window.SpeechRecognition ||
    window.webkitSpeechRecognition ||
    null;

if (!SpeechRecognition) {
    document.querySelector('.js-api-support').removeAttribute('hidden');
    document.querySelector('.js-api-info').setAttribute('hidden', '');
    [].forEach.call(document.querySelectorAll('form button'), function (button) {
        button.setAttribute('disabled', '');
    });
} else {
    var recognizer = new SpeechRecognition();
    var transcription = document.getElementById('transcription');


    function startReconition() {
        transcription.textContent = '';

        // Set if we need interim results
        var isInterimResults = document.querySelector('input[name="recognition-type"][value="interim"]').checked;

        recognizer.lang = document.getElementById('language').value;
        recognizer.continuous = !isInterimResults;
        recognizer.interimResults = isInterimResults;

        try {
            recognizer.start();
            logEvent('Recognition started');
        } catch (ex) {
            logEvent('Recognition error: ' + ex.message);
        }
    }

    function stopRecognition() {
        console.log('*** Stopping');
        recognizer.stop();
        logEvent('Recognition stopped');
    }

    // Start recognising
    recognizer.addEventListener('result', function (event) {
        transcription.textContent = '';

        for (var i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                transcription.textContent = event.results[i][0].transcript +
                    ' (Confidence: ' + event.results[i][0].confidence + ')';
                const url = 'http://localhost:3000/question/text'
                fetch(url, {
                    method: 'post',
                    headers: {
                        "Content-type": "application/json; charset=UTF-8"
                    },
                    body: JSON.stringify({
                        'queryText': event.results[i][0].transcript,
                        'languageCode': "en-US"
                    })
                })
                    .then(response => response.json())
                    .then((data) => {
                        console.log('Request succeeded with JSON response:', data.response);
                        showCommand('system.popupToast', data.response);
                    })
                    .catch(function (error) {
                        console.log('Request failed', error);
                    });

            } else {
                transcription.textContent += event.results[i][0].transcript;
            }
        }
    });

    // Listen for errors
    recognizer.addEventListener('error', function (event) {
        logEvent('Recognition error: ' + event.message);
    });

    recognizer.addEventListener('end', function () {
        logEvent('Recognition ended');
    });



    document.getElementById('button-play').addEventListener('click', startReconition);


    document.getElementById('button-stop').addEventListener('click', stopRecognition);

    document.getElementById('clear-all').addEventListener('click', function () {
        document.getElementById('log').textContent = '';
    });
}