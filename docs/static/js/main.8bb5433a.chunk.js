(this["webpackJsonp@time-input-polyfill/react"]=this["webpackJsonp@time-input-polyfill/react"]||[]).push([[0],{251:function(t){t.exports=JSON.parse('{"a":"2.0.0"}')},446:function(t,e,n){},458:function(t,e,n){},729:function(t,e,n){"use strict";n.r(e);n(256),n(265);var o=n(5),l=n.n(o),i=n(249),a=n.n(i),r=(n(446),n(115),n(125),n(126),n(127),n(128),n(129),n(130),n(131),n(132),n(133),n(134),n(135),n(136),n(137),n(138),n(200),n(201),n(203),n(81),n(140),n(141),n(215),n(142),n(219),n(224),n(93),n(447),n(453),n(455),n(457),n(193),n(194),n(195),n(145),n(173)),c=n(174),s=n(177),u=n(176),m=n(66),p=n(21),f=n(114),b=(n(458),n(113)),j=n.n(b),d=n(250),h=n.n(d),O=n(175),v=n(4),y=["value","setValue","forcePolyfill","onChange","onFocus","onBlur","onMouseDown","onMouseUp","onKeyDown","className","style","polyfillSource"],g=function(t){var e=t.value,n=void 0===e?"":e,l=t.setValue,i=t.forcePolyfill,a=void 0!==i&&i,r=t.onChange,c=t.onFocus,s=t.onBlur,u=t.onMouseDown,b=t.onMouseUp,d=t.onKeyDown,g=t.className,x=void 0===g?"":g,S=t.style,w=t.polyfillSource,V=void 0===w?"https://cdn.jsdelivr.net/npm/@time-input-polyfill/utils@1":w,C=Object(f.a)(t,y),T=a||!h.a,k=Object(o.useRef)(n),I=function(t){k.current=t,l(t)},P=Object(o.useRef)(null),D=Object(o.useState)(null),E=Object(p.a)(D,2),L=E[0],N=E[1],F=Object(o.useState)(!1),A=Object(p.a)(F,2),U=A[0],M=A[1],B=Object(o.useState)(!1),R=Object(p.a)(B,2),H=R[0],K=R[1],J=Object(o.useState)(O.blankValues.string12hr),z=Object(p.a)(J,2),W=z[0],$=z[1],G=Object(o.useState)(O.blankValues.timeObject),q=Object(p.a)(G,2),Q=q[0],X=q[1],Y=Object(o.useState)(null),Z=Object(p.a)(Y,2),_=Z[0],tt=Z[1],et=Object(o.useRef)(_),nt=Object(o.useState)(!1),ot=Object(p.a)(nt,2),lt=ot[0],it=ot[1],at=Object(o.useState)(null),rt=Object(p.a)(at,2),ct=rt[0],st=rt[1];Object(o.useEffect)((function(){n!==k.current&&L&&X(L.convertString24hr(n).toTimeObject())}),[n,L]);var ut=Object(o.useState)(void 0),mt=Object(p.a)(ut,2),pt=mt[0],ft=mt[1];Object(o.useEffect)((function(){var t,e=function(){ft(n),setTimeout((function(){return ft(void 0)}),1)},o=P.current;return null===o||void 0===o||null===(t=o.form)||void 0===t||t.addEventListener("submit",e),function(){var t;null===o||void 0===o||null===(t=o.form)||void 0===t||t.removeEventListener("submit",e)}}),[n]);Object(o.useEffect)((function(){if(L&&T){var t=L.convertTimeObject,e=L.getCursorSegment,n=L.selectSegment,o=_||e(P.current),l=t(Q).to24hr(),i=t(Q).to12hr();W!==i&&($(i),I(l)),lt&&setTimeout((function(){n(P.current,o)}))}}),[lt,_,L,T,Q]),Object(o.useEffect)((function(){if(L&&T){var t=L.a11yUpdate,e=L.getA11yValue;setTimeout((function(){e()&&t(P.current,["update"])}))}}),[Q,L,T]),Object(o.useEffect)((function(){if(L&&T){var t=L.convertString24hr,e=L.matchesTimeObject,o=t(n).toTimeObject(),l=function(t){if(!L||!T)return{};var e=function(e){return null===t[e]},n=L.timeObjectKeys;return{hasBlankValues:n.some(e),isAllBlankValues:n.every(e)}}(o).hasBlankValues;e(o,Q)||!U||l||X(o)}}),[n,L,T]),Object(o.useEffect)((function(){T&&j()(V,(function(){if(window.timeInputPolyfillUtils){var t=window.timeInputPolyfillUtils,e=t.convertString12hr,o=t.convertString24hr,l=t.a11yCreate,i=t.getA11yElement,a=t.ManualEntryLog,r=t.getNextSegment;N(window.timeInputPolyfillUtils);var c=o(n).toTimeObject();X(c),i()||l(),st(new a({timeObject:c,onUpdate:function(t){var n=t.fullValue12hr,o=e(n).toTimeObject();X(o)},onLimitHit:function(){tt(r(et.current))}})),M(!0)}}))}),[T]);var bt=function(){ct&&_&&ct[_].reset()};Object(o.useEffect)((function(){et.current=_;var t=document.activeElement===P.current;if(L&&T&&t){var e=L.a11yUpdate,n=L.getA11yValue;setTimeout((function(){n()?e(P.current,["select"]):e(P.current,["initial","select"])}))}}),[_,L,T]),Object(o.useEffect)((function(){bt()}),[_,ct]);var jt=T?"react-time-input-polyfill-target":"",dt=Object(m.a)({fontFamily:"monospace"},S),ht=void 0===pt?W:pt;return Object(v.jsx)("input",Object(m.a)(Object(m.a)({},C),{},{onChange:function(t){r&&r(t),I(t.target.value)},onFocus:function(t){if(c&&c(t),L&&T){it(!0);var e=L.isShiftHeldDown,n=L.getCursorSegment,o=L.a11yUpdate;H?setTimeout((function(){tt(n(P.current))})):tt(e?"mode":"hrs12"),bt(),o(P.current,["initial","select"])}},onBlur:function(t){s&&s(t),it(!1),K(!1),null===L||void 0===L||L.a11yClear()},onMouseDown:function(t){u&&u(t),K(!0)},onMouseUp:function(t){b&&b(t),L&&T&&L.selectCursorSegment(P.current)},onKeyDown:function(t){if(d&&d(t),L&&T){var e=t.key,n=function(){return r&&r(t)},o=L.modifyTimeObject,l=L.getCursorSegment,i=L.getNextSegment,a=L.getPrevSegment,c=L.isShiftHeldDown,s=L.regex,u=_||l(P.current);if("ArrowUp"===e)_||tt(u),t.preventDefault(),bt(),X(o(Q).increment[u].isolated()),n();else if("ArrowDown"===e)_||tt(u),t.preventDefault(),bt(),X(o(Q).decrement[u].isolated()),n();else if("ArrowLeft"===e)t.preventDefault(),tt(a(_));else if("ArrowRight"===e)t.preventDefault(),tt(i(_));else if("Tab"===e){if(!(c&&"hrs12"===_||!c&&"mode"===_)){t.preventDefault();var m=c?a(_):i(_);tt(m)}}else["Backspace","Delete"].includes(e)?(t.preventDefault(),_&&X(o(Q).clear[_]()),n()):s.alphaNumericKeyName.test(e)&&ct&&(t.preventDefault(),ct[u].add(e),n())}},ref:P,type:T?"text":"time",value:T?ht:n,style:dt,className:[x,jt].join(" ").trim()||void 0}))},x=l.a.memo(g),S=n(733),w=n(732),V=n(251),C=["label","codeString"],T=function(t){var e=t.label,n=t.codeString,l=Object(f.a)(t,C),i=Object(o.useState)("20:30"),a=Object(p.a)(i,2),r=a[0],c=a[1],s=Object(o.useState)(!0),u=Object(p.a)(s,2),b=u[0],j=u[1],d=e.replace(/[^A-z]+/g,"-").replace(/-+$/g,"");return Object(v.jsxs)("form",{style:{marginBottom:"2em"},onSubmit:function(t){return t.preventDefault()},children:[Object(v.jsx)("h2",{children:e}),Object(v.jsxs)("span",{style:{display:"inline-block"},children:[Object(v.jsx)("label",{htmlFor:d+"-input",style:{marginRight:"0.5em"},children:e}),Object(v.jsx)(x,Object(m.a)({value:r,setValue:c,className:"exampleClass",id:d+"-input",forcePolyfill:b},l)),Object(v.jsxs)("button",{onClick:function(){return j(!b)},style:{marginLeft:10},id:d+"-toggle-polyfill",title:"Toggle polyfill",children:["Polyfill is ",Object(v.jsx)("strong",{children:b?"ON":"OFF"})]})]}),Object(v.jsxs)("p",{children:[Object(v.jsxs)("button",{onClick:function(){return c("07:15")},id:d+"-button-1",children:["Set ",e.toLocaleLowerCase()," time to 7:15 AM"]}),Object(v.jsxs)("button",{onClick:function(){return c("15:45")},id:d+"-button-2",children:["Set ",e.toLocaleLowerCase()," time to 3:45 PM"]}),Object(v.jsxs)("button",{onClick:function(){return c("")},id:d+"-button-3",children:["Set ",e.toLocaleLowerCase(),' time to " "']})]}),Object(v.jsxs)("p",{children:[e,' returned value: "',Object(v.jsx)("span",{id:d+"-return-value",children:r}),'"']}),Boolean(n)&&Object(v.jsx)(S.a,{style:w.a,className:"code",language:"javascript",showLineNumbers:!0,children:n.replace(/^\n/,"")})]})},k=function(t){Object(s.a)(n,t);var e=Object(u.a)(n);function n(){var t;Object(r.a)(this,n);for(var o=arguments.length,l=new Array(o),i=0;i<o;i++)l[i]=arguments[i];return(t=e.call.apply(e,[this].concat(l))).state={forcePolyfill:!0},t}return Object(c.a)(n,[{key:"render",value:function(){var t=this,e=this.props,n=e.value,o=e.setValue,l=this.state.forcePolyfill,i="class-based-component-example";return Object(v.jsxs)("span",{style:{display:"inline-block"},children:[Object(v.jsx)("label",{style:{marginRight:"0.5em"},htmlFor:"".concat(i,"-input"),children:"Class based version"}),Object(v.jsx)(x,{value:n,setValue:o,forcePolyfill:l,id:"".concat(i,"-input")}),Object(v.jsxs)("button",{onClick:function(){return t.setState({forcePolyfill:!l})},style:{marginLeft:10},title:"Toggle polyfill",id:"".concat(i,"-toggle-polyfill"),children:["Polyfill is ",Object(v.jsx)("strong",{children:l?"ON":"OFF"})]})]})}}]),n}(o.Component),I=function(t){Object(s.a)(n,t);var e=Object(u.a)(n);function n(){var t;Object(r.a)(this,n);for(var o=arguments.length,l=new Array(o),i=0;i<o;i++)l[i]=arguments[i];return(t=e.call.apply(e,[this].concat(l))).state={value:"20:30"},t.exampleId="class-based-component-example",t}return Object(c.a)(n,[{key:"setValue",value:function(t){this.setState({value:t})}},{key:"render",value:function(){var t=this,e=this.state.value;return Object(v.jsxs)("form",{style:{marginBottom:"2em"},onSubmit:function(t){return t.preventDefault()},children:[Object(v.jsx)("h2",{children:"Class based component example"}),Object(v.jsx)("p",{children:"The time input polyfill has been optimized to work best with React Hooks but you can still use it in a class based component."}),Object(v.jsx)(k,{value:this.state.value,setValue:function(e){return t.setState({value:e})}}),Object(v.jsxs)("p",{children:[Object(v.jsx)("button",{onClick:function(){return t.setValue("07:15")},id:this.exampleId+"-button-1",children:"Set class based time to 7:15 AM"}),Object(v.jsx)("button",{onClick:function(){return t.setValue("15:45")},id:this.exampleId+"-button-2",children:"Set class based time to 3:45 PM"}),Object(v.jsx)("button",{onClick:function(){return t.setValue("")},id:this.exampleId+"-button-3",children:'Set class based time to " "'})]}),Object(v.jsxs)("p",{id:"class-based-component-return-value",children:['class based returned value: "',e,'"']}),Object(v.jsx)(S.a,{style:w.a,className:"code",language:"javascript",showLineNumbers:!0,children:"\n\t/* TimeInput.js */\n\n\timport React, { Component } from 'react'\n\n\t// Import the component into your project\n\timport TimeInputPolyfill from '@time-input-polyfill/react'\n\n\texport class TimeInput extends Component {\n\t\trender() {\n\t\t\tconst { value, setValue, label } = this.props\n\t\t\treturn (\n\t\t\t\t\t<label>\n\t\t\t\t\t\t<span>\n\t\t\t\t\t\t\t{label}\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<TimeInputPolyfill\n\t\t\t\t\t\t\tvalue={value}\n\t\t\t\t\t\t\tsetValue={setValue}\n\t\t\t\t\t\t/>\n\t\t\t\t\t</label>\n\t\t\t)\n\t\t}\n\t}\n\n\t///////////////////////////////////////////////////\n\n\t/* ExampleForm.js */\n\n\timport React, { Component } from 'react'\n\n\t// import your local time input component into your form component\n\timport { TimeInput } from './TimeInput'\n\n\texport class ExampleForm extends Component {\n\t\tstate = { inputValue: '20:30' }\n\t\trender() {\n\t\t\treturn (\n\t\t\t\t<form>\n\t\t\t\t\t<TimeInput\n\t\t\t\t\t\tlabel=\"Label text\"\n\n\t\t\t\t\t\t// Use the state value to set the time\n\t\t\t\t\t\tvalue={this.state.inputValue}\n\n\t\t\t\t\t\t// Pass a state setter function into the component\n\t\t\t\t\t\tsetValue={(newValue) => this.setState({inputValue: newValue})}\n\t\t\t\t\t/>\n\t\t\t\t\t<button type=\"submit\">Submit</button>\n\t\t\t\t</form>\n\t\t\t)\n\t\t}\n\t}\n".replace(/^\n/,"")})]})}}]),n}(o.Component);var P=function(){var t=Object(o.useState)("default"),e=Object(p.a)(t,2),n=(e[0],e[1],Object(o.useState)("none")),l=Object(p.a)(n,2),i=(l[0],l[1],Object(o.useState)("none")),a=Object(p.a)(i,2);return a[0],a[1],Object(v.jsxs)("div",{className:"App",children:[Object(v.jsx)("h1",{children:"React Time Input Polyfill"}),Object(v.jsx)("p",{children:Object(v.jsxs)("i",{children:["v",V.a]})}),Object(v.jsx)("p",{children:"Code examples are simplified guides, not exact code replicas."}),Object(v.jsx)(S.a,{style:w.a,className:"code centered",language:"text",showLineNumbers:!1,children:"npm install @time-input-polyfill/react"}),Object(v.jsx)("p",{children:Object(v.jsx)("a",{href:"https://github.com/Dan503/react-time-input-polyfill#react-time-input-polyfill",children:"Visit me on GitHub"})}),Object(v.jsx)(T,{label:"Polyfill demo",codeString:"\n\t/* TimeInput.js */\n\n\timport React from 'react'\n\n\t// Import the component into your project\n\timport TimeInputPolyfill from '@time-input-polyfill/react'\n\n\texport const TimeInput = ({ label, value, setValue }) => {\n\t\treturn (\n\t\t\t<label>\n\t\t\t\t<span>{label}</span>\n\t\t\t\t<TimeInputPolyfill\n\n\t\t\t\t\t// Set the value through props\n\t\t\t\t\tvalue={value}\n\n\t\t\t\t\t// Pass the state setter\n\t\t\t\t\tsetValue={setValue}\n\n\t\t\t\t\t/*  Force browsers that support input[type=time]\n\t\t\t\t\t\tto use the polyfill.\n\t\t\t\t\t\t(useful for testing and debugging)\n\t\t\t\t\t*/  forcePolyfill={true}\n\t\t\t\t/>\n\t\t\t</label>\n\t\t)\n\t}\n\n\t///////////////////////////////////////////////////\n\n\t/* ExampleForm.js */\n\n\timport React, { useState } from 'react'\n\n\t// import your local time input component into your form component\n\timport { TimeInput } from './TimeInput'\n\n\texport const ExampleForm = ()=> {\n\n\t\t// Use state to keep track of the value\n\t\tconst [inputValue, setInputValue] = useState('20:30') // default to 8:30 PM\n\n\t\t// Make use of useEffect to react to inputValue changes\n\t\tuseEffect(() => {\n\t\t\tconsole.log({ inputValue })\n\t\t}, [ inputValue ])\n\n\t\treturn (\n\t\t\t<form>\n\t\t\t\t<TimeInput\n\t\t\t\t\tlabel=\"Label text\"\n\n\t\t\t\t\t// Use the state value to set the time\n\t\t\t\t\tvalue={inputValue}\n\n\t\t\t\t\t// Pass the state setter function into the component\n\t\t\t\t\tsetValue={setInputValue}\n\t\t\t\t/>\n\t\t\t\t<button type=\"submit\">Submit</button>\n\t\t\t</form>\n\t\t)\n\t}\n"}),Object(v.jsx)(I,{}),!1]})};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));j()("https://polyfill.io/v3/polyfill.min.js?features=Promise%2CObject.assign&flags=gated",(function(){a.a.render(Object(v.jsx)(P,{}),document.getElementById("root"))})),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))}},[[729,1,2]]]);
//# sourceMappingURL=main.8bb5433a.chunk.js.map