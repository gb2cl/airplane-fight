
var planeDiv;
var myPlane;

// 背景图片的y坐标
var backgroundY=0;

//控制创建飞机的时间
var time1=0;
var time2=0;
//敌方飞机的数组
var enemyArr=[];
var bulletArr=[];

var timer;
var body;
var isPause=false;
var suspendDiv;
var enddiv;
var plane_Score=0;
var planeScore;
var scoreSpan;


//窗口加载完毕
window.onload=function(){
     // 拿到开始游戏的button
    var beginButton=document.getElementById('beginButton');
       // 拿到开始游戏的盒子
    var beginDiv=document.getElementById('beginDiv');
      // 拿到打飞机的盒子
  planeDiv=document.getElementById('planeDiv');
  

     // 添加点击事件
  body=document.getElementsByTagName('body')[0];
  suspendDiv=document.getElementById('suspendDiv');
  enddiv=document.getElementById('enddiv');
  planeScore=document.getElementById('planeScore');
  scoreSpan=document.getElementById('score');

    beginButton.onclick=function(){
    beginDiv.style.display='none';
    planeDiv.style.display='block';



     // 每隔多长时间调用函数
   timer=setInterval(movingBG,30);
}
//创建本方飞机
 myPlane=new MyPlane(127,488);

addEvent(planeDiv,'mousemove',moveAirPlane);
addEvent(body,'mousemove',moveBorder);
addEvent(myPlane.imgNode,'click',suspendPlane);
addEvent(suspendDiv.getElementsByTagName('button')[0],'click',suspendPlane);
addEvent(suspendDiv.getElementsByTagName('button')[1],'click',replay);



}
function replay(){
  window.location.reload();
}

//移动飞机
function moveAirPlane(evt){
  evt=evt||window.event;
  var distance=(document.body.clientWidth-320)/2;

  //拿到飞机标签
  var ourAirPlane=myPlane.imgNode;

  //改变飞机的left，top
ourAirPlane.style.left=evt.clientX-distance-33+'PX';
ourAirPlane.style.top=evt.clientY-40+'PX';



}
function moveBorder(evt){
  evt=evt||window.evt;
  var bodyX=evt.clientX;
  var bodyY=evt.clientY;
 var distance=(document.body.clientWidth-320)/2;
 if(bodyX<distance||bodyX>(distance+320)||bodyY<0||bodyY>568)
 {
  removeEvent(planeDiv,'mousemove',moveAirPlane);
 }else{
  addEvent(planeDiv,'mousemove',moveAirPlane);
}
}
function suspendPlane(){
  if(isPause){
    timer=setInterval(movingBG,30);
     addEvent(planeDiv,'mousemove',moveAirPlane);
     addEvent(body,'mousemove',moveBorder);
     suspendDiv.style.display='none';
     isPause=false;
  }
  else{
    clearInterval(timer);
    suspendDiv.style.display='block';
  removeEvent(planeDiv,'mousemove',moveAirPlane);
  removeEvent(body,'mousemove',moveBorder);
  isPause=true;
  }
  
}

// 移动背景图片
function movingBG(){

    // 取得背景图片的y坐标
    planeDiv.style.backgroundPositionY=backgroundY+'px';

    // 改变y坐标
    backgroundY+=.5;
    
    if(backgroundY==568){
        backgroundY=0;
    }
    time1++;
    if(time1==25){
        time2++;
        if (time2%5==0) {
            //中型飞机
            var middPlane=new EnemyPlane(274,-100,46,60,"image/enemy3_fly_1.png","image/中飞机爆炸.gif",2,200,7,300);
        enemyArr.push(middPlane);
        }
        if (time2==25) {
            
            var largePlane=new EnemyPlane(210,-100,110,164,"image/enemy2_fly_1.png","image/大飞机爆炸.gif",1,300,12,500);
          enemyArr.push(largePlane);
          time2=0;
        }else{
                  //创建小飞机
           var smallPlane=new EnemyPlane(286,-100,34,24,"image/enemy1_fly_1.png","image/小飞机爆炸.gif",3,100,1,100);
           enemyArr.push(smallPlane);   
  }
  time1=0;
  }
  //敌方飞机个数
var enemyPlaneLength=enemyArr.length;
for(var i=0; i<enemyPlaneLength; i++){
    //取出敌机
    var enemyPlane=enemyArr[i];
    if(!enemyPlane.planeisdie){
    enemyPlane.movePlane();
   }else{
    enemyPlane.dieBeginTime+=10;
    if(enemyPlane.dieBeginTime==enemyPlane.dieTime){
    planeDiv.removeChild(enemyPlane.imgNode);
    enemyArr.splice(i,1);
    enemyPlaneLength--;
   }
 }
   //敌机超出边界删除
   if(enemyPlane.imgNode.offsetTop>=568){
    //移除图片节点
   planeDiv.removeChild(enemyPlane.imgNode);
     enemyArr.splice(i,1);
     enemyPlaneLength--;
}
 }
 if(time1%5==0){
 //创建子弹
  var bullet = new Bullet(myPlane.imgNode.offsetLeft+31,myPlane.imgNode.offsetTop-10);
    bulletArr.push(bullet);
  }
    var bulletLength=bulletArr.length;
    for(var i=0;i<bulletLength;i++){
      var bullet1=bulletArr[i];
      bullet1.moveBullet();
      if(bullet1.bulletImage.offsetTop<=0){
        planeDiv.removeChild(bullet1.bulletImage);
        bulletArr.splice(i,1);
        bulletLength--;
      }
    }
    //碰撞判断
    for(var i=0;i<bulletLength;i++){
      for(var j=0;j<enemyPlaneLength;j++){
        if(enemyArr[j].planeisdie==false){
          if(myPlane.imgNode.offsetLeft<=enemyArr[j].imgNode.offsetLeft+enemyArr[j].planeWidth&&
                    myPlane.imgNode.offsetLeft+myPlane.planeWidth>=enemyArr[j].imgNode.offsetLeft){
            if (myPlane.imgNode.offsetTop<=enemyArr[j].imgNode.offsetTop+enemyArr[j].planeHeight
              &&myPlane.imgNode.offsetTop+myPlane.planeHeight>=enemyArr[j].imgNode.offsetTop){
              clearInterval(timer);
             removeEvent(planeDiv,'mousemove',moveAirPlane);
             removeEvent(body,'mousemove',moveBorder);
             removeEvent(myPlane.imgNode,'click',suspendPlane);
             enddiv.style.display='block';

             planeScore.innerHTML=plane_Score;
             myPlane.imgNode.src=myPlane.boomImgSrc;

            } 
          }
          var everyBullet=bulletArr[i].bulletImage;
          var everyEnemy=enemyArr[j].imgNode; 
          var x1=everyBullet.offsetLeft+6>=everyEnemy.offsetLeft;
          var x2=everyBullet.offsetLeft<=everyEnemy.offsetLeft+enemyArr[j].planeWidth;
          var y1=everyBullet.offsetTop+14>=everyEnemy.offsetTop;
          var y2=everyBullet.offsetTop<=everyEnemy.offsetTop+enemyArr[j].planeHeight;
          if(x1&&x2){
            if(y1&&y2){
             enemyArr[j].blood-=bulletArr[i].attack;
             if(enemyArr[j].blood==0){
              plane_Score+=enemyArr[j].score;
              scoreSpan.innerHTML=plane_Score;
              enemyArr[j].imgNode.src=enemyArr[j].boomImgSrc;
              enemyArr[j].planeisdie=true;
             }
             planeDiv.removeChild(everyBullet);
             bulletArr.splice(i,1);
             bulletLength--;
             break;

            }
          }
        }
      }
    }

}
  



// 飞机的构造函数
function Plane(x,y,width,height,imgSrc,boomImgSrc,speed,dieTime,blood,score){
      this.planeX=x;
      this.planeY=y;
      this.planeWidth=width;
      this.planeHeight=height;
      this.boomImgSrc=boomImgSrc;
      this.speed=speed;
      this.dieBeginTime=0;


      this.dieTime=dieTime;

      this.blood=blood;
      this.score=score;

      this.planeisdie=false;
      //创建图片标签
      this.init=function(){
        //创建图片
        this.imgNode=document.createElement('img');
        //图片路径
       this.imgNode.src=imgSrc;
       //飞机显示位置
       this.imgNode.style.top=this.planeY+'px';
       this.imgNode.style.left=this.planeX+'px';
       //添加子节点
       planeDiv.appendChild(this.imgNode); 
       
      };
      //显示图片
      this.init();
      //自动向下移动
      this.movePlane=function(){
        //获取到像素值
        this.imgNode.style.top=this.speed+this.imgNode.offsetTop+'px';
      }
}
//创建本方飞机
function MyPlane(x,y){
    //冒充对象1. 要冒充的对象2.被冒充对象的形参
    Plane.call(this,x,y,66,80,'image/我的飞机.gif','image/本方飞机爆炸.gif',0,9999,1,1);

}
//创建敌方飞机的函数
function EnemyPlane(max,y,width,height,imgSrc,boomImgSrc,speed,dieTime,blood,score){
    Plane.call(this,random(max),y,width,height,imgSrc,boomImgSrc,speed,dieTime,blood,score);
}
//求敌方飞机的随机数
function random(max){
    return Math.random()*max;

}
//子弹的函数
function Bullet(x,y){
    this.bulletX=x;
    this.bulletY=y;
    this.bulletWidth=6;
    this.bulletHeight=14;
    this.attack=1;
    this.init=function(){
        this.bulletImage=document.createElement('img');
        this.bulletImage.style.top=this.bulletY+'px';
        this.bulletImage.style.left=this.bulletX+'px';
        this.bulletImage.src='image/bullet1.png';
        planeDiv.appendChild(this.bulletImage);
    }
this.init();
this.moveBullet=function(){
this.bulletImage.style.top=this.bulletImage.offsetTop-20+'px';
}
}
//跨浏览器添加事件1.给哪个事件添加事件，2 事件类型 3响应的函数或方法
function addEvent(obj,type,fn){
  if(obj,addEventListener){
    obj.addEventListener(type,fn,false)
  }else if(obj.attactEvent){
    obj.attactEvent('on'+type,fn);
  }
}
//跨浏览器移除事件
function removeEvent(obj,type,fn){
  if(obj.removeEventListener){
    obj.removeEventListener(type,fn,false)
  }else if(obj.detachEvent){
    obj.detachEvent('on'+type,fn);
  }
}
