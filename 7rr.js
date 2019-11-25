//  7rr

const pl = `
canvas_basic_module import
rec_module import
list_module import
subscription_module import

# init a pounce connection to a canvas tag with id 'maine'
maine cb-init cb-clear
[250] [width] def
[150] [height] def
[7] [boxes] def

# random rectangle data in list form
[[]
 random width * random width * dup2 > [swap] if [dup] dip swap -
 [1 round push] dip 1 round push
 random height * random height * dup2 > [swap] if [dup] dip swap -
 [1 round push] dip 1 round push
 random 255 * 1 round push
 random 255 * 1 round push
 random 255 * 1 round push
 random 255 * 1 round push
 0 push
] [random-rectangle-list] def

# rectangle-rec (takes a list of data)
[{x:0 w:0 y:0 h:0}
  [uncons swap] dip swap x set
  [uncons swap] dip swap w set
  [uncons swap] dip swap y set
  [uncons swap] dip swap h set
  {r:180 g:150 b:150 a:0.5}
    [uncons swap] dip2 rolldown r set
    [uncons swap] dip2 rolldown g set
    [uncons swap] dip2 rolldown b set
    [uncons swap] dip2 rolldown 255 / 0.01 round a set
  color set
  [uncons drop] dip swap s set
] [rectangle-rec] def

[ rectangle-rec cb-box] [box] def

# background-rectangle-list
[[0] width push 0 push height push 
random 0.5 < [0] [255] ifte 
dup [push] dip
dup [push] dip
push
255 push
0 push
] [background-rectangle-list] def

# make a nice random composition of rectangles 
[ [] background-rectangle-list push [random-rectangle-list push] boxes repeat] [comp] def

# paint the nice random composition of rectangles 
[ pop boxb [pop boxr] boxes repeat] [paint] def

# compress example input [253 254 255 2 1 0 10 20 30]
[[pop 16 << swap pop 8 << swap pop swap [+ +] dip] 3 repeat
drop
36 int2s 
[36 int2s] dip 
[36 int2s] dip2
['-'] dip2
['-'] dip
str-append str-append str-append str-append] [compress] def

['-' str-split
 [] 
[swap
36 s2int 
 dup 255 AND swap
dup 255 8 << AND 8 >> swap
dup 255 16 << AND 16 >> swap drop
 [push] dip2 [push] dip push] 3 repeat] [decompress] def


#random-rectangle-list dup
#compress
#dup
#decompress
#rectangle-rec


# save this composition to storage
[count store.get
1 + dup count store.set
art swap str-append store.set] [save] def

# draw the initail composition
 
[[0 250 0 150 0 0 0 255 0] 
[106 63 9 52 252 76 58 67 0] 
[27 210 33 85 77 146 42 98 0] 
[41 194 20 111 242 202 157 105 0] 
[107 61 44 1 145 65 68 230 0] 
[8 14 2 147 215 151 177 2 0] 
[37 18 18 15 255 42 40 38 0] 
[77 128 44 33 93 161 5 139 0]
]
#comp
dup
# uncons swap box [uncons swap box] boxes repeat drop

[pop compress '+' str-append] [bite] def
[pop compress
 [bite] dip str-append
 [bite] dip str-append
 [bite] dip str-append
 [bite] dip str-append
 [bite] dip str-append
 [bite] dip str-append
 [bite] dip str-append
 [drop] dip] [zip] def

['+' str-split
 decompress [] cons
[decompress] dip cons
[decompress] dip cons
[decompress] dip cons
[decompress] dip cons
[decompress] dip cons
[decompress] dip cons
[decompress] dip cons
] [unzip] def

 zip
 dup
 unzip
 log
dup
 uncons swap box [uncons swap box] boxes repeat drop


['up Vote' log drop] [upVote] def
['down Vote' log drop] [dnVote] def
[viewLTcount [1 goview] [cb-clear comp dup [cb-box] map drop] ifte ] [nextArt] def
[-1 goview] [prevArt] def


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
count store.get not [0 count store.set] if
view store.get not [count store.get view store.set] if

[ dup 0 <
    [view store.get + view store.set 
        art view store.get str-append store.get [cb-box] map]
    [view store.get 
        art view store.get str-append 
    store.get + view store.set [cb-box] map]
  ifte       
] [goview] def

[view store.get count store.get <] [viewLTcount] def

`;
const out = pounce.run(Pounce_ast.parse(pl+' ', {actions: parser_actions.parser_actions}), [], [pounce.words])[1][0];

// const topEle = document.getElementById('top');
// const p = document.createElement('p');
// p.textContent = out.toString();
// topEle.appendChild(p);