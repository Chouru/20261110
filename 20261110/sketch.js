let role1Sheet; // 宣告角色1的精靈圖變數
let role1WalkSheet; // 宣告角色1走路精靈圖變數
let role1MagicSheet; // 宣告角色1施法精靈圖變數
let magicEffectSheet; // 宣告魔法特效精靈圖變數
let roleCenterX; // 宣告角色1中心點的水平位置
let roleDirection = 0; // 設定角色移動方向，0為靜止、1為向右、-1為向左
let roleFacing = 1; // 記錄角色面向方向，初始面向右方
let castFacing = 1; // 記錄本次施法時角色面向的方向
let isCasting = false; // 記錄角色是否正在播放施法動畫
let isSpaceDown = false; // 記錄空白鍵是否已按住以避免重複觸發
let castStartFrame = 0; // 記錄本次施法動畫的開始影格
let magicEffects = []; // 儲存畫面上飛行中的魔法特效
const role1StopFrameCount = 10; // 設定角色1停止精靈圖的影格總數
const role1WalkFrameCount = 9; // 設定角色1走路精靈圖的影格總數
const role1MagicFrameCount = 4; // 設定角色1施法精靈圖的影格總數
const magicEffectFrameCount = 5; // 設定魔法特效精靈圖的影格總數

function preload() { // 在畫布建立前載入角色1圖片
  role1Sheet = loadImage("1/stop/stop.png"); // 載入角色1的10格停止精靈圖
  role1WalkSheet = loadImage("1/walk/walk.png"); // 載入角色1的9格走路精靈圖
  role1MagicSheet = loadImage("1/maigc/maigc.png"); // 載入角色1的4格施法精靈圖
  magicEffectSheet = loadImage("1/魔法特效/魔法特效.png"); // 載入5格魔法特效精靈圖
} // 結束圖片載入函式

function setup() { // 設定畫布與動畫播放方式
  createCanvas(windowWidth, windowHeight); // 建立符合瀏覽器視窗大小的畫布
  imageMode(CENTER); // 使用圖片中心作為繪製座標以便左右轉向
  roleCenterX = width * 2 / 3; // 將角色初始中心放在畫布寬度的三分之二處
  frameRate(60); // 將繪圖更新速率設定為每秒60次
} // 結束初始設定函式

function draw() { // 每次更新畫面時繪製背景與角色
  background(135, 206, 235); // 使用天空藍作為畫布背景
  const castFrameIndex = floor((frameCount - castStartFrame) / 6); // 計算施法動畫目前播放到的影格
  if (isCasting && castFrameIndex >= role1MagicFrameCount) { // 判斷施法動畫是否已播放完畢
    isCasting = false; // 結束施法狀態並切回一般角色動畫
    magicEffects.push({ x: roleCenterX + castFacing * 40, y: height - height * 0.35 * 0.45, direction: castFacing, speed: constrain(width * 0.012, 4, 14) }); // 在角色前方建立朝施法方向飛行的特效
  } // 結束施法動畫完成判斷
  const isWalking = !isCasting && roleDirection !== 0; // 判斷角色是否正在走路
  const currentSheet = isCasting ? role1MagicSheet : isWalking ? role1WalkSheet : role1Sheet; // 依角色狀態選擇施法、走路或停止精靈圖
  const currentFrameCount = isCasting ? role1MagicFrameCount : isWalking ? role1WalkFrameCount : role1StopFrameCount; // 取得目前精靈圖的影格數
  const frameWidth = currentSheet.width / currentFrameCount; // 計算目前精靈圖中每格的寬度
  const frameHeight = currentSheet.height; // 取得目前精靈圖每格的高度
  const frameIndex = isCasting ? castFrameIndex : floor(frameCount / 6) % currentFrameCount; // 施法動畫單次播放，其餘動畫循環播放
  const roleScale = min(height * 0.35 / frameHeight, width * 0.3 / frameWidth); // 依畫布高度與寬度限制角色等比例縮放
  const roleDisplayWidth = frameWidth * roleScale; // 計算縮放後角色的顯示寬度
  const roleDisplayHeight = frameHeight * roleScale; // 計算縮放後角色的顯示高度
  const movementSpeed = constrain(width * 0.006, 2, 8); // 依畫布寬度調整角色移動速度
  if (!isCasting) { // 角色施法時暫停移動
    roleCenterX += roleDirection * movementSpeed; // 依目前方向逐格移動角色
  } // 結束施法移動限制
  roleCenterX = constrain(roleCenterX, roleDisplayWidth / 2, width - roleDisplayWidth / 2); // 限制角色不超出畫布左右邊界
  const roleY = height - roleDisplayHeight / 2; // 將角色圖片底部對齊畫布底部
  push(); // 暫存目前的繪圖狀態
  translate(roleCenterX, roleY); // 將座標原點移至角色中心
  scale((isCasting ? castFacing : roleFacing) === -1 ? -1 : 1, 1); // 角色面向左方時水平翻轉圖片
  image(currentSheet, 0, 0, roleDisplayWidth, roleDisplayHeight, frameIndex * frameWidth, 0, frameWidth, frameHeight); // 依縮放尺寸繪製目前的精靈圖影格
  pop(); // 還原繪圖狀態以免影響後續畫面
  const effectFrameWidth = magicEffectSheet.width / magicEffectFrameCount; // 計算魔法特效每格的原始寬度
  const effectFrameHeight = magicEffectSheet.height; // 取得魔法特效每格的原始高度
  const characterFrameWidth = role1Sheet.width / role1StopFrameCount; // 計算角色停止精靈圖每格的原始寬度
  const effectScale = min(height * 0.35 / role1Sheet.height, width * 0.3 / characterFrameWidth); // 使用角色縮放比例維持特效與角色的大小關係
  const effectDisplayWidth = effectFrameWidth * effectScale; // 計算縮放後魔法特效的顯示寬度
  const effectDisplayHeight = effectFrameHeight * effectScale; // 計算縮放後魔法特效的顯示高度
  for (let effectIndex = magicEffects.length - 1; effectIndex >= 0; effectIndex--) { // 由後往前更新所有飛行中的特效
    const effect = magicEffects[effectIndex]; // 取得目前更新的特效
    effect.x += effect.direction * effect.speed; // 讓特效朝角色面向的方向移動
    if (effect.x < -effectDisplayWidth / 2 || effect.x > width + effectDisplayWidth / 2) { // 判斷特效是否已離開畫布
      magicEffects.splice(effectIndex, 1); // 移除離開畫布的特效
      continue; // 略過已移除特效的繪製
    } // 結束特效離開畫布判斷
    const effectFrameIndex = floor(frameCount / 6) % magicEffectFrameCount; // 計算特效目前播放到的影格
    push(); // 暫存目前的繪圖狀態
    translate(effect.x, effect.y); // 將座標原點移至特效中心
    scale(effect.direction, 1); // 依特效飛行方向翻轉圖片
    image(magicEffectSheet, 0, 0, effectDisplayWidth, effectDisplayHeight, effectFrameIndex * effectFrameWidth, 0, effectFrameWidth, effectFrameHeight); // 繪製目前的特效影格
    pop(); // 還原繪圖狀態以免影響後續畫面
  } // 結束所有特效更新與繪製
} // 結束畫面繪製函式

function keyPressed() { // 按下左右方向鍵時設定角色移動方向
  if (keyCode === RIGHT_ARROW) { // 判斷是否按下右方向鍵
    roleDirection = 1; // 設定角色向右移動並面向右方
    roleFacing = 1; // 記錄角色面向右方
    return false; // 阻止瀏覽器因方向鍵捲動畫面
  } // 結束右方向鍵判斷
  if (keyCode === LEFT_ARROW) { // 判斷是否按下左方向鍵
    roleDirection = -1; // 設定角色向左移動並面向左方
    roleFacing = -1; // 記錄角色面向左方
    return false; // 阻止瀏覽器因方向鍵捲動畫面
  } // 結束左方向鍵判斷
  if (keyCode === 32 && !isSpaceDown) { // 判斷是否首次按下空白鍵
    isSpaceDown = true; // 記錄空白鍵已按住以忽略鍵盤重複事件
    if (!isCasting) { // 確認目前沒有正在播放的施法動畫
      isCasting = true; // 開始播放施法動畫
      castStartFrame = frameCount; // 記錄施法動畫開始影格
      castFacing = roleFacing; // 固定本次施法時的角色面向
    } // 結束施法開始判斷
    return false; // 阻止空白鍵造成瀏覽器頁面捲動
  } // 結束空白鍵判斷
} // 結束鍵盤輸入處理函式

function keyReleased() { // 放開左右方向鍵時停止角色移動
  if (keyCode === 32) { // 判斷是否放開空白鍵
    isSpaceDown = false; // 允許下次按空白鍵再次施法
    return false; // 阻止空白鍵放開事件造成瀏覽器操作
  } // 結束空白鍵放開判斷
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) { // 判斷放開的是否為左右方向鍵
    roleDirection = 0; // 設定角色為靜止狀態以切回停止精靈圖
    return false; // 阻止瀏覽器因方向鍵放開事件捲動畫面
  } // 結束方向鍵放開判斷
} // 結束鍵盤放開事件處理函式

function windowResized() { // 瀏覽器視窗尺寸改變時重新調整畫布
  const positionRatio = roleCenterX / width; // 記錄角色原本相對於畫布寬度的位置
  resizeCanvas(windowWidth, windowHeight); // 讓畫布持續填滿瀏覽器視窗
  roleCenterX = positionRatio * width; // 依新畫布寬度還原角色相對位置
} // 結束視窗縮放處理函式
