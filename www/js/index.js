/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var HOST_PORT = '192.168.0.1:8002'; // Configure IP LAN Local & Port

var app = {
    buttonRef: undefined,
    messageRef: undefined,

    inAppBrowserRef: undefined,

    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        var button = document.querySelector('.app input');
        var message = document.querySelector('.app p.message');

        button.addEventListener('click', this.onButtonClicked.bind(this));
        
        button.disabled = '';
        message.textContent = '';

        this.buttonRef = button;
        this.messageRef = message;
    },

    onButtonClicked: function() {
        this.buttonRef.disabled = 'disabled';

        this.messageRef.textContent = 'Loading...';

        var iab = cordova.InAppBrowser.open(this.url(), '_blank', 'location=no,hidden=yes');
        
        iab.addEventListener('loadstart', this.loadStartCallBack.bind(this));
        iab.addEventListener('loadstop', this.loadStopCallBack.bind(this));
        iab.addEventListener('loaderror', this.loadErrorCallBack.bind(this));
        iab.addEventListener('message', this.messageCallBack.bind(this));
        iab.addEventListener('exit', this.exitCallBack.bind(this));

        this.inAppBrowserRef = iab;
    },

    url: function() {
        return 'http://' + HOST_PORT + '/index.html';
    },

    loadStartCallBack: function() {
        this.messageRef.textContent = 'Loading...';
    },
    
    loadStopCallBack: function() {
        if (this.inAppBrowserRef != undefined) {
            
            this.inAppBrowserRef.executeScript({ code: "\
                typeof webkit !== 'undefined' && \
                typeof webkit.messageHandlers !== 'undefined' && \
                typeof webkit.messageHandlers.cordova_iab !== 'undefined' && \
                typeof webkit.messageHandlers.cordova_iab.postMessage !== 'undefined'"
            }, this.postMessageEnabledCallBack.bind(this));
        }
    },

    postMessageEnabledCallBack: function(params) {
        var postMessageEnabled = params[0];

        this.inAppBrowserRef.executeScript({ code: "\
            var message = undefined;\
            var form = document.forms[0];\
            form.addEventListener('submit', function(event) {\
                document.querySelector('input[type=submit]').disabled = 'disabled';\
                message = JSON.stringify({'name':document.querySelector('input[name=\"username\"]').value});" +
                (postMessageEnabled ? "webkit.messageHandlers.cordova_iab.postMessage(message);" : "") +
                "event.preventDefault();\
                return false;\
            });"
        });

        if (!postMessageEnabled) {
            
            this.pollingMessage();
        }

        this.inAppBrowserRef.show();

        this.messageRef.textContent = '';
    },

    loadErrorCallBack: function() {
        this.inAppBrowserRef.executeScript({ code: "\
            alert('Something went wrong!\\nOur Engineers are on it');"
        });
    
        this.messageRef.textContent = '';
        
        this.inAppBrowserRef.close();
    },

    messageCallBack: function(params) {
        this.showMessage(params.data.name);
        
        this.inAppBrowserRef.close();
    },

    exitCallBack: function() {
        this.buttonRef.disabled = '';

        this.inAppBrowserRef = undefined;
    },

    pollingMessage: function() {
        if (this.inAppBrowserRef != undefined) {
        
            this.inAppBrowserRef.executeScript({ code: 
                'message'
            }, this.pollingMessageCallBack.bind(this));
        }
    },

    pollingMessageCallBack: function(params) {
        if (params[0] == undefined) {
            
            setTimeout(this.pollingMessage.bind(this), 1000);

            return;
        } 
        
        this.showMessage(JSON.parse(params[0]).name);
            
        this.inAppBrowserRef.close();
    },

    showMessage: function(name) {
        this.messageRef.textContent = 'Hello ' + name + '!';
    }
};

app.initialize();
