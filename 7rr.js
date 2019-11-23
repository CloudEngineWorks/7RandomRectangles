//  7rr

const pl = `
canvas_basic_module import
maine cb-init cb-clear
rec_module import
list_module import
subscription_module import

[250] [width] def
[7] [boxes] def
    
[{x:0 y:0 w:0 h:0}
 random 250 * random 250 * dup2 > [swap] if [dup] dip swap -
 [ 1 round x set] dip  1 round w set
 random 150 * random 150 * dup2 > [swap] if [dup] dip swap -
 [ 1 round y set] dip  1 round h set
 {r:180 g:150 b:150 a:0.5}
      random 255 * 1 round r set
      random 255 * 1 round g set
      random 255 * 1 round b set
      random 0.01 round a set
 color set
] [boxr] def

[{x:0 y:0 w:250 h:150} 
    {r:0 g:0 b:0 a:1}
    #random 255 * 1 round r set
    random 0.5 < [0] [255] ifte 
 dup [r set] dip
 dup [g set] dip
 dup [b set] dip
 drop
 color set 
] [boxb] def

[ boxb   [boxr] boxes repeat [] [swap push] boxes repeat cons] [comp] def

[count store.get
1 + dup count store.set
art swap str-append store.set] [save] def

# draw the initail composition
maine cb-init cb-clear comp dup [cb-box] map drop

['up Vote' log drop] [upVote] def
['down Vote' log drop] [dnVote] def
[viewLTcount [1 goview] [cb-clear comp dup [cb-box] map drop] ifte ] [nextArt] def
[ -1 goview] [prevArt] def
   

[drop dup abs 15 > [0 > [dnVote] [upVote] ifte] if] [vertical] def
[dup abs 15 > [0 > [prevArt] [nextArt] ifte] if drop] [horizontal] def
[depth 1 > [merge] if x get ox set y get oy set true inGesture set] [startGesture] def
[inGesture get [ox get [x get] dip - 
 [oy get [y get] dip -] dip dup2 
abs [abs] dip > [vertical] [horizontal] ifte] if]  [gesture2action] def
[depth 1 > [merge gesture2action false inGesture set] if false inGesture set depth 1 > [[drop] dip] if] [endGesture] def

[startGesture] [mousedown] maine subscribe
[endGesture] [mouseup] maine subscribe
#[endGesture] [mouseout] maine subscribe
#[endGesture] [mouseleave] maine subscribe

#[[drop drop] dip2] [pointerdown] maine subscribe
#[[drop drop] dip2] [pointerup] maine subscribe
#[[drop drop] dip2] [pointermove] maine subscribe
#[[drop drop] dip2] [pointerleave] maine subscribe

# init view index
view store.get not [count store.get view store.set] if

[ view store.get swap + view store.set 
    art view store.get str-append store.get [cb-box] map] [goview] def

[view store.get count store.get <] [viewLTcount] def

`;
const out = pounce.run(Pounce_ast.parse(pl+' ', {actions: parser_actions.parser_actions}), [], [pounce.words])[1][0];

// const topEle = document.getElementById('top');
// const p = document.createElement('p');
// p.textContent = out.toString();
// topEle.appendChild(p);