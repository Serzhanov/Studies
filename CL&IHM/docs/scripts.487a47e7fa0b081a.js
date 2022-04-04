"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(r){return typeof r}:function(r){return r&&"function"==typeof Symbol&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r};!function(r,c){"function"==typeof define&&define.amd?define([],function(){return r.annyang=c(r)}):"object"===("undefined"==typeof module?"undefined":_typeof(module))&&module.exports?module.exports=c(r):r.annyang=c(r)}("undefined"!=typeof window?window:void 0,function(r,c){var d,R=r.SpeechRecognition||r.webkitSpeechRecognition||r.mozSpeechRecognition||r.msSpeechRecognition||r.oSpeechRecognition;if(!R)return null;var i,y,p=[],s={start:[],error:[],end:[],soundstart:[],result:[],resultMatch:[],resultNoMatch:[],errorNetwork:[],errorPermissionBlocked:[],errorPermissionDenied:[]},w=0,S=0,a=!1,h="font-weight: bold; color: #00f;",m=!1,v=!1,D=/\s*\((.*?)\)\s*/g,$=/(\(\?:[^)]+\))\?/g,z=/(\(\?)?:\w+/g,E=/\*\w+/g,M=/[\-{}\[\]+?.,\\\^$|#]/g,N=function(e){return e=e.replace(M,"\\$&").replace(D,"(?:$1)?").replace(z,function(t,n){return n?t:"([^\\s]+)"}).replace(E,"(.*?)").replace($,"\\s*$1?\\s*"),new RegExp("^"+e+"$","i")},u=function(e){for(var t=arguments.length,n=Array(t>1?t-1:0),o=1;o<t;o++)n[o-1]=arguments[o];e.forEach(function(l){l.callback.apply(l.context,n)})},P=function(){return i!==c},f=function(e,t){-1!==e.indexOf("%c")||t?console.log(e,t||h):console.log(e)},k=function(){P()||d.init({},!1)},C=function(e,t,n){p.push({command:e,callback:t,originalPhrase:n}),a&&f("Command successfully loaded: %c"+n,h)},b=function(e){u(s.result,e);for(var t,n=0;n<e.length;n++){t=e[n].trim(),a&&f("Speech recognized: %c"+t,h);for(var o=0,l=p.length;o<l;o++){var g=p[o],A=g.command.exec(t);if(A){var x=A.slice(1);return a&&(f("command matched: %c"+g.originalPhrase,h),x.length&&f("with parameters",x)),g.callback.apply(this,x),void u(s.resultMatch,t,g.originalPhrase,e)}}}u(s.resultNoMatch,e)};return d={init:function(e){var t=!(arguments.length>1&&arguments[1]!==c)||arguments[1];i&&i.abort&&i.abort(),(i=new R).maxAlternatives=5,i.continuous="http:"===r.location.protocol,i.lang="en-US",i.onstart=function(){v=!0,u(s.start)},i.onsoundstart=function(){u(s.soundstart)},i.onerror=function(n){switch(u(s.error,n),n.error){case"network":u(s.errorNetwork,n);break;case"not-allowed":case"service-not-allowed":y=!1,(new Date).getTime()-w<200?u(s.errorPermissionBlocked,n):u(s.errorPermissionDenied,n)}},i.onend=function(){if(v=!1,u(s.end),y){var n=(new Date).getTime()-w;(S+=1)%10==0&&a&&f("Speech Recognition is repeatedly stopping and starting. See http://is.gd/annyang_restarts for tips."),n<1e3?setTimeout(function(){d.start({paused:m})},1e3-n):d.start({paused:m})}},i.onresult=function(n){if(m)return a&&f("Speech heard, but annyang is paused"),!1;for(var o=n.results[n.resultIndex],l=[],g=0;g<o.length;g++)l[g]=o[g].transcript;b(l)},t&&(p=[]),e.length&&this.addCommands(e)},start:function(e){k(),m=(e=e||{}).paused!==c&&!!e.paused,y=e.autoRestart===c||!!e.autoRestart,e.continuous!==c&&(i.continuous=!!e.continuous),w=(new Date).getTime();try{i.start()}catch(t){a&&f(t.message)}},abort:function(){y=!1,S=0,P()&&i.abort()},pause:function(){m=!0},resume:function(){d.start()},debug:function(){var e=!(arguments.length>0&&arguments[0]!==c)||arguments[0];a=!!e},setLanguage:function(e){k(),i.lang=e},addCommands:function(e){var t;for(var n in k(),e)if(e.hasOwnProperty(n))if("function"==typeof(t=r[e[n]]||e[n]))C(N(n),t,n);else{if(!("object"===(void 0===t?"undefined":_typeof(t))&&t.regexp instanceof RegExp)){a&&f("Can not register command: %c"+n,h);continue}C(new RegExp(t.regexp.source,"i"),t.callback,n)}},removeCommands:function(e){e===c?p=[]:(e=Array.isArray(e)?e:[e],p=p.filter(function(t){for(var n=0;n<e.length;n++)if(e[n]===t.originalPhrase)return!1;return!0}))},addCallback:function(e,t,n){var o=r[t]||t;"function"==typeof o&&s[e]!==c&&s[e].push({callback:o,context:n||this})},removeCallback:function(e,t){var n=function(l){return l.callback!==t};for(var o in s)s.hasOwnProperty(o)&&(e!==c&&e!==o||(s[o]=t===c?[]:s[o].filter(n)))},isListening:function(){return v&&!m},getSpeechRecognizer:function(){return i},trigger:function(e){return d.isListening()?(Array.isArray(e)||(e=[e]),void b(e)):void(a&&f(v?"Speech heard, but annyang is paused":"Cannot trigger while annyang is aborted"))}}});