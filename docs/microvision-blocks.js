
// Original Program by Bob Eichler
// Mouse sensitivity feature added by Lee K. Seitz (look for the LKS comments)

function FormStartUp() {
  MovingDownAndOut = false;
  MovingUpAndOut = false;
  timerRunning=false;
  if(IE)
    MouseCurrX = event.clientX + document.body.scrollLeft;
  else
    MouseCurrX = 100;
  PaddlePos = 8;
  ClearScreen();
  CurrentState='SettingOptions';
  TotalBallCount = 9;
  ChangeTotalBallCount();
  FastSpeedDelay=50;
  SlowSpeedDelay=100;
  StartSpeed = FastSpeedDelay;
  ChangeSpeed();
  PaddleSize=2;
  ChangePaddleSize();
  Score=0;
  SkipCellClear = false;
  vdir='d';
  r=7;
  WallArray = new Array(3);
  WallArray[0] = new Array(16);
  WallArray[1] = new Array(16);
  WallArray[2] = new Array(16);
  GreyPaddlePos = -1;
  LightGreyPaddlePos = -1;
  olderr = -1;
  olderc = -1
  oldr = -1
  oldc = -1
  DiminishPaddleTimer();
  MouseSensitivity=4;  // LKS
  //UpdateStatus(); //LKS
}


function ResetScript() {
  ClearScreen();
  BuildWall();
}

function RedrawBall() {
  olderr = oldr;
  olderc = oldc;
  oldr=r;
  oldc=c;

 // If we're moving down from rows 3, 4 or 5, or up from 7, 6, or 5,
 // we have to see if there is a block in our path.  If so, delete the
 // block and bounce off it.
  if(BlockCollsionOccurred()==false) {

    if(vdir=='d') {
     // If we're moving down to row 15, then we have to look for the Paddle
     // to see if it will bounce us back up
      if(r==15) {
        if(PaddlePos == c) {
          vdir='u';
          r = 14;
          if(PaddleSize > 2)
            hdir='c';
          else
            hdir='r';
        }
        else {
          if (PaddlePos - 1 == c) {
            vdir='u';
            hdir='l';
            r = 14;
          }
          else {
            if ((PaddlePos + 1 == c) && (PaddleSize > 2)) {
              vdir='u';
              hdir='r';
              r = 14;
            }
            else {
              r++;
            }
          }
        }
      }
      else {
        if(r==16) {
         // We've reached row 16 going down
          ContinueMoving = false;
          for(oc=1; oc<17; oc++) {
            CellOff(16, oc);
          }
          //window.alert('You missed the ball!  You have ' + BallsLeft + ' balls left to play.');
          ClearScreen();
          DisplayScore();
          if(BallsLeft > 0) {
            DrawCharacter(1,1,BallsLeft);
            BallsLeft = BallsLeft - 1;
            CurrentState = 'BetweenBalls';
          }
          else {
            CurrentState = 'GameOver';
          }
          return;
        }
        else
  	  r++;
      }
    }

    else {  // Going UP
     // If we've gotten to the top of the screen, bounce off it and start back down
      if(r==1) {
        vdir='d';
        r=2;
      }
      else
	r--;
    }

    if(hdir=='r') {  // Going RIGHT
     // If we're at the right edge of the screen, we need to bounce off and go left
      if(c==16) {
        hdir='l';
        c = 15;
      }
      else
        c++;
    }
    else {
      if (hdir=='l') {  // Going LEFT
       // If we're at the left edge of the screen, we need to bounce off and go right
        if(c==1) {
          hdir='r';
          c = 2;
        }
        else
          c--;
      }
    }
  }

 // Draw "vapor trail"
  if(document.getElementById('chkVapor').checked) {
    if(olderr > 0 && olderc > 0) {
      if(olderr < 4 || olderr > 6) {
        CellOff(olderr, olderc);
      }
      else {
        if(BlockStillThere(olderr, olderc) == false)
          CellOff(olderr, olderc);
      }
    }
    if(oldr > 0 && oldc > 0) {
      if(oldr < 4 || oldr > 6) {
        LightGreyCell(oldr, oldc);
      }
      else {
        if(BlockStillThere(oldr, oldc) == false)
          LightGreyCell(oldr, oldc);
      }
    }
  }
  else {
    if(oldr > 0 && oldc > 0) {
      if(oldr < 4 || oldr > 6) {
        CellOff(oldr, oldc);
      }
      else {
        if(BlockStillThere(oldr, oldc) == false)
          CellOff(oldr, oldc);
      }
    }
  }

 // Draw ball at new position
  CellOn(r,c);

}

function BlockCollsionOccurred() {
 // Init the flag that says NOT to clear out the cell the ball just moved FROM.
 // If the ball is "rebounding" and goes through a still-there wall block, this
 // flag will be set to true.
  SkipCellClear=false;

 // If MovingDownAndOut is true, that means we're rebounding from an upward hit,
 // so continue moving downward but don't hit anything.
  if(MovingDownAndOut==true) {
    if(WallArray[oldr-4][oldc-1]==1)
      SkipCellClear = true;
    if(oldr>5)
      MovingDownAndOut = false;
    return false;
  }

 // If MovingUpAndOut is true, that means we're rebounding from a downward hit,
 // so continue moving upward but don't hit anything.
  if(MovingUpAndOut==true) {
    if(WallArray[oldr-4][oldc-1]==1)
      SkipCellClear = true;
    if(oldr<5)
      MovingUpAndOut = false;
    return false;
  }

 // Check if we're moving up and there's a block directly above us.  If so, hit it,
 // which will erase the block and reverse the direction of the ball's up/down.
  if(vdir=='u' && (r == 5 || r == 6 || r == 7)) {
    BlockAbove = false;
    BlockCol = 0;
    if(hdir=='c' && BlockStillThere(r-1,c)) {
      BlockAbove = true;
      BlockCol = c;
    }
    if(hdir=='r') {
      if(BlockStillThere(r-1,c)) {
        BlockAbove = true;
        BlockCol = c;
      }
      else {
        if(c<16) {
          if(BlockStillThere(r-1,c+1)) {
            BlockAbove = true;
            BlockCol = c + 1;
          }
        }
        else {
          if(BlockStillThere(r-1,c-1)) {
            BlockAbove = true;
            BlockCol = c - 1;
          }
        }
      }
    }
    if(hdir=='l') {
      if(BlockStillThere(r-1,c)) {
        BlockAbove = true;
        BlockCol = c;
      }
      else {
        if(c>1) {
          if(BlockStillThere(r-1,c-1)) {
            BlockAbove = true;
            BlockCol = c - 1;
          }
        }
        else {
          if(BlockStillThere(r-1,c+1)) {
            BlockAbove = true;
            BlockCol = c + 1;
          }
        }
      }
    }
    if(BlockAbove) {
      //window.alert('BlockAbove is true, r: ' + r + ', BlockCol: ' + BlockCol);
      CellOff(r-1, BlockCol);
      Score = Score + (8-r);
      WallArray[r-5][BlockCol-1] = 0;
      CheckForEmptyWall();
      if(r-1 == 4)
        BallSpeed=FastSpeedDelay;
      r++;
      if(hdir=='r'){
        if(c==16) {
          hdir='l';
          c=15;
        }
        else {
          c++;
        }
      }
      else {
        if(hdir=='l') {
          if(c==1) {
            hdir='r';
            c=2;
          }
          else {
            c--;
          }
        }
      }
      if(r<6)
        MovingDownAndOut=true;
      vdir = 'd';
      return true;
    }
  }

 // Check if we're moving down and there's a block directly below us.  If so, hit it,
 // which will erase the block and reverse the direction of the ball's up/down.
  if(vdir=='d' && (r == 3 || r == 4 || r == 5)) {
    BlockBelow = false;
    BlockCol = 0;
    if(hdir=='c' && BlockStillThere(r+1,c)) {
      BlockBelow = true;
      BlockCol = c;
    }
    if(hdir=='r') {
      if(BlockStillThere(r+1,c)) {
        BlockBelow = true;
        BlockCol = c;
      }
      else {
        if(c<16) {
          if(BlockStillThere(r+1,c+1)) {
            BlockBelow = true;
            BlockCol = c + 1;
          }
        }
        else {
          if(BlockStillThere(r+1,c-1)) {
            BlockBelow = true;
            BlockCol = c - 1;
          }
        }
      }
    }
    if(hdir=='l') {
      if(BlockStillThere(r+1,c)) {
        BlockBelow = true;
        BlockCol = c;
      }
      else {
        if(c>1) {
          if(BlockStillThere(r+1,c-1)) {
            BlockBelow = true;
            BlockCol = c - 1;
          }
        }
        else {
          if(BlockStillThere(r+1,c+1)) {
            BlockBelow = true;
            BlockCol = c + 1;
          }
        }
      }
    }
    if(BlockBelow) {
      CellOff(r+1, BlockCol);
      Score = Score + (6-r);
      WallArray[r-3][BlockCol-1] = 0;
      CheckForEmptyWall();
      if(r+1 == 4)
        BallSpeed=FastSpeedDelay;
      r--;
      if(hdir=='r'){
        if(c==16) {
          hdir='l';
          c=15;
        }
        else {
          c++;
        }
      }
      else {
        if(hdir=='l') {
          if(c==1) {
            hdir='r';
            c=2;
          }
          else {
            c--;
          }
        }
      }
      if(r>4)
        MovingUpAndOut=true;
      vdir = 'u';
      return true;
    }
  }

return false;
}

function Go() {
  if(CurrentState=='SettingOptions') {
    ClearScreen();
    BuildWall();
    PaddlePos=7;
    RepositionPaddle(8);
    CurrentState='ReadyToPlay';
    Score=0;
    //UpdateStatus(); //LKS
    return;
  }

  if(CurrentState=='ReadyToPlay') {
    if(timerRunning==false) {
      r=7;
      c=1+Math.floor(15*Math.random());
      vdir='d';
      if(1+Math.floor(10*Math.random()) > 4)
        hdir='r';
      else
        hdir='l';
      ContinueMoving=true;
      BallSpeed=StartSpeed;
      BallsLeft=TotalBallCount-1;
      Score=0;
      CurrentState='Playing';

   //TESTCODE!!!
   // ClearScreen();
   // for(x=0;x<3;x++) {
   //   for(y=0;y<16;y++) {
   //     WallArray[x][y] = 0;
   //   }
   // }
   // WallArray[0][0] = 1;
   // DrawWall();
   // c=10;
   // hdir='r';
   //end-o-testcode

      StartTheTimer();
    }
  }

  if(CurrentState=='Playing') {
    if(timerRunning==false) {
      r=7;
      c=1+Math.floor(15*Math.random());
      vdir='d';
      if(1+Math.floor(10*Math.random()) > 4)
        hdir='r';
      else
        hdir='l';
      ContinueMoving=true;
      BallSpeed=StartSpeed;
      CurrentState='Playing';
      StartTheTimer();
    }
  }

  if(CurrentState=='BetweenBalls') {
    if(timerRunning==false) {
      r=7;
      c=1+Math.floor(15*Math.random());
      vdir='d';
      if(1+Math.floor(10*Math.random()) > 4)
        hdir='r';
      else
        hdir='l';
      ContinueMoving=true;
      BallSpeed=StartSpeed;
      ClearScreen();
      DrawWall();
      LightGreyPaddlePos = -1;
      GreyPaddlePos = -1;
      //if(PaddlePos > 2)
      //  RepositionPaddle(PaddlePos--);
      //else
      //  RepositionPaddle(PaddlePos++);
      if(PaddlePos > 1)
        CellOn(16, PaddlePos-1);
      CellOn(16, PaddlePos);
      if (PaddleSize==3 && PaddlePos < 16)
        CellOn(16, PaddlePos+1);
      CurrentState='Playing';
    }
  }

  if(CurrentState=='GameOver') {
    FormStartUp();
  }

  //UpdateStatus(); //LKS
}

function StartTheTimer() {
  if (ContinueMoving == false) {
    if(timerRunning)
       clearTimeout(timerID);
    timerRunning = false;
  }
  else {
    //self.status = movecount;
    timerRunning = true;

    RedrawBall();

    if(document.getElementById('chkHalf').checked)
      timerID = self.setTimeout("StartTheTimer()", BallSpeed * 2);
    else
      timerID = self.setTimeout("StartTheTimer()", BallSpeed);
  }
}

function DiminishPaddleTimer() {
  DiminishPaddleTrails();
  timerID2 = self.setTimeout("DiminishPaddleTimer()", 75);
}

function DiminishPaddleTrails() {
  if (LightGreyPaddlePos > 0) {
    CellOff(16, LightGreyPaddlePos);
    LightGreyPaddlePos = -1;
  }
  if (GreyPaddlePos > 0) {
    LightGreyCell(16, GreyPaddlePos);
    LightGreyPaddlePos = GreyPaddlePos;
    GreyPaddlePos = -1;
  }
}

function CellOn(Row, Col) {
  if(Row < 1 || Row > 16) return;
  if(Col < 1 || Col > 16) return;
  getTableCell('ScreenTable', Row, Col).bgColor = 'black';
}

function CellOff(Row, Col) {
  if(Row < 1 || Row > 16) return;
  if(Col < 1 || Col > 16) return;
  getTableCell('ScreenTable', Row, Col).bgColor = 'gainsboro';
}

function GreyCell(Row, Col) {
  if(Row < 1 || Row > 16) return;
  if(Col < 1 || Col > 16) return;
  getTableCell('ScreenTable', Row, Col).bgColor = 'gray';
}

function LightGreyCell(Row, Col) {
  if(Row < 1 || Row > 16) return;
  if(Col < 1 || Col > 16) return;
  getTableCell('ScreenTable', Row, Col).bgColor = 'silver';
}

function BlockStillThere(Row, Col) {
  if(Row < 4 || Row > 6) return false;
  if(Col < 1 || Col > 16) return false;
  return (WallArray[Row-4][Col-1] == 1);
}

function getTableCell(id, row, cell){
    var vRow = document.getElementById( id ).rows[ row - 1 ];
    var i=0, j=1;
    for(;i < vRow.childNodes.length; i ++ ){
     if( "TD" == vRow.childNodes[ i ].nodeName ){
      if( j == cell ) return vRow.childNodes[ i ];
      j ++;
     }
    }
    return null;
   }

function RespondToMouse(e) {
  DiminishPaddleTrails();
  if(CurrentState=='SettingOptions' || CurrentState=='BetweenBalls' || CurrentState=='GameOver')
    return;
  if(IE)
    tempX = event.clientX + document.body.scrollLeft;
  else
    tempX = e.pageX;
  // LKS
  if(tempX < MouseCurrX-MouseSensitivity) {
    RepositionPaddle(PaddlePos - 1);
    MouseCurrX = tempX;
  }
  // LKS
  else {
    if(tempX > MouseCurrX+MouseSensitivity) {
      RepositionPaddle(PaddlePos + 1);
      MouseCurrX = tempX;
    }
  }
  return true;
}

function RepositionPaddle(Pos) {
  if (PaddleSize > 2) {
    if(Pos < 0) {
      Pos = 0;
    }
  }
  else {
    if(Pos < 1) {
      Pos = 1;
    }
  }
  if(Pos > 17)
    Pos = 17;
  if(Pos != PaddlePos) {
   // Clear Previous Paddle
    if(PaddlePos - 1 > 0 && PaddlePos - 1 < 17) {
      CellOff(16,PaddlePos - 1);
    }
    if(PaddlePos > 0 && PaddlePos < 17) {
      CellOff(16,PaddlePos);
    }
    if(PaddleSize > 2) {
      if(PaddlePos + 1 > 0 && PaddlePos + 1 < 17) {
        CellOff(16,PaddlePos + 1);
      }
    }

   // Draw a "vapor trail" for the paddle
    if(document.getElementById('chkVapor').checked) {
      if (Pos > PaddlePos) {
        if (PaddleSize==3) {
          GreyPaddlePos = PaddlePos - 1;
          if(GreyPaddlePos < 1)
            GreyPaddlePos = -1;
          else
            GreyCell(16,GreyPaddlePos);
          LightGreyPaddlePos = PaddlePos - 2;
          if(LightGreyPaddlePos < 1)
            LightGreyPaddlePos = -1;
          else
  	  LightGreyCell(16,LightGreyPaddlePos);
        }
        else {
          GreyPaddlePos = PaddlePos - 1;
          if(GreyPaddlePos < 1)
            GreyPaddlePos = -1;
          else
            GreyCell(16,GreyPaddlePos);
          LightGreyPaddlePos = PaddlePos - 2;
          if(LightGreyPaddlePos < 1)
            LightGreyPaddlePos = -1;
          else
  	  LightGreyCell(16,LightGreyPaddlePos);
        }
      }
      else {
        if (PaddleSize==3) {
          GreyPaddlePos = PaddlePos + 1;
          if(GreyPaddlePos > 16)
            GreyPaddlePos = -1;
          else
            GreyCell(16,GreyPaddlePos);
          LightGreyPaddlePos = PaddlePos + 2;
          if(LightGreyPaddlePos > 16)
            LightGreyPaddlePos = -1;
          else
  	  LightGreyCell(16,LightGreyPaddlePos);
       }
        else {
          GreyPaddlePos = PaddlePos;
          if(GreyPaddlePos > 16)
            GreyPaddlePos = -1;
          else
            GreyCell(16,GreyPaddlePos);
          LightGreyPaddlePos = PaddlePos + 1;
          if(LightGreyPaddlePos > 16)
            LightGreyPaddlePos = -1;
          else
  	  LightGreyCell(16,LightGreyPaddlePos);
        }
      }
    }

   // Draw new Paddle
    PaddlePos = Pos;
    if(PaddlePos - 1 > 0 && PaddlePos - 1 < 17) {
      CellOn(16,PaddlePos - 1);
    }
    if(PaddlePos > 0 && PaddlePos < 17) {
      CellOn(16,PaddlePos);
    }
    if(PaddleSize > 2) {
      if(PaddlePos + 1 > 0 && PaddlePos + 1 < 17) {
        CellOn(16,PaddlePos + 1);
      }
    }
  }
}

function BuildWall() {
  for(BuildR=0;BuildR<3;BuildR++) {
    for(BuildC=0;BuildC<16;BuildC++) {
      WallArray[BuildR][BuildC] = 1;
    }
  }
  DrawWall();

  if ((vdir == 'u' && (r==4 || r==5)) || (vdir == 'd' && (r==5 || r==6))) {
    SkipCellClear = true;
    if (vdir=='u')   // u instead of d because we haven't changed directions yet
      MovingDownAndOut = true;
    else
      MovingUpAndOut = true;
  }
}

function DrawWall() {
  for(DrawR=0;DrawR<3;DrawR++) {
    for(DrawC=0;DrawC<16;DrawC++) {
      if(WallArray[DrawR][DrawC]==1)
        CellOn(DrawR+4,DrawC+1);
      else
	CellOff(DrawR+4,DrawC+1);
    }
  }
}

function ClearScreen() {
  for(clearrow=1;clearrow<17;clearrow++) {
    for(clearcol=1;clearcol<17;clearcol++) {
      CellOff(clearrow, clearcol);
    }
  }
}

function CheckForEmptyWall() {
  BlockFound = false;
  for(lcr=0;lcr<3;lcr++) {
    for(lcc=0;lcc<16;lcc++) {
      if(WallArray[lcr][lcc] == 1)
        BlockFound = true;
    }
  }
  if(BlockFound == false) {
    BuildWall();
  }
}

function DrawCharacter(TopLeftR, TopLeftC, Charac) {
  var CArray = new Array(5);
  switch(Charac) {
    case 0: {
      CArray[0]='XXX';CArray[1]='X X';CArray[2]='X X';CArray[3]='X X';CArray[4]='XXX'; break;}
    case 1: {
      CArray[0]='XX ';CArray[1]=' X ';CArray[2]=' X ';CArray[3]=' X ';CArray[4]='XXX'; break;}
    case 2: {
      CArray[0]='XXX';CArray[1]='  X';CArray[2]='XXX';CArray[3]='X  ';CArray[4]='XXX'; break;}
    case 3: {
      CArray[0]='XXX';CArray[1]='  X';CArray[2]=' XX';CArray[3]='  X';CArray[4]='XXX'; break;}
    case 4: {
      CArray[0]='X X';CArray[1]='X X';CArray[2]='XXX';CArray[3]='  X';CArray[4]='  X'; break;}
    case 5: {
      CArray[0]='XXX';CArray[1]='X  ';CArray[2]='XXX';CArray[3]='  X';CArray[4]='XXX'; break;}
    case 6: {
      CArray[0]='XXX';CArray[1]='X  ';CArray[2]='XXX';CArray[3]='X X';CArray[4]='XXX'; break;}
    case 7: {
      CArray[0]='XXX';CArray[1]='  X';CArray[2]='  X';CArray[3]='  X';CArray[4]='  X'; break;}
    case 8: {
      CArray[0]='XXX';CArray[1]='X X';CArray[2]='XXX';CArray[3]='X X';CArray[4]='XXX'; break;}
    case 9: {
      CArray[0]='XXX';CArray[1]='X X';CArray[2]='XXX';CArray[3]='  X';CArray[4]='  X'; break;}
    case 'S': {
      CArray[0]=' XX';CArray[1]='X  ';CArray[2]='XXX';CArray[3]='  X';CArray[4]='XX '; break;}
    case 'F': {
      CArray[0]='XXX';CArray[1]='X  ';CArray[2]='XX ';CArray[3]='X  ';CArray[4]='X  '; break;}
    case 'D': {
      CArray[0]='XX ';CArray[1]='X X';CArray[2]='X X';CArray[3]='X X';CArray[4]='XX '; break;}
    case 'T': {
      CArray[0]='XXX';CArray[1]=' X ';CArray[2]=' X ';CArray[3]=' X ';CArray[4]=' X '; break;}
  }
  for(ArrayCount=0;ArrayCount<5;ArrayCount++) {
    for(CAD=0;CAD<3;CAD++) {
      if (CArray[ArrayCount].charAt(CAD) == 'X')
        CellOn(TopLeftR+ArrayCount, TopLeftC+CAD);
      else
        CellOff(TopLeftR+ArrayCount, TopLeftC+CAD);
    }
  }
}

function ChangeTotalBallCount() {
  if(CurrentState=='SettingOptions') {
    TotalBallCount = TotalBallCount - 2;
    if(TotalBallCount < 0)
      TotalBallCount = 9;
    DrawCharacter(1,1,TotalBallCount);
  }
}

function ChangeSpeed() {
  if(CurrentState=='SettingOptions') {
    if(StartSpeed==SlowSpeedDelay) {
      StartSpeed=FastSpeedDelay;
      DrawCharacter(1,10,'F');
    }
    else {
      StartSpeed=SlowSpeedDelay;
      DrawCharacter(1,10,'S');
    }
  }
}

function ChangePaddleSize() {
  if(CurrentState=='SettingOptions') {
    if(PaddleSize==3) {
      PaddleSize=2;
      DrawCharacter(1,14,'D');
    }
    else {
      PaddleSize=3;
      DrawCharacter(1,14,'T');
    }
  }
}

function DisplayScore() {
 // Display "middle" digit
  if(Score<10) {
    DrawCharacter(1,10,0);
  }
  else {
    if(Score>99) {
      TensScore = Score % 100;
    }
    else {
      TensScore = Score;
    }
    TensScore = TensScore - (TensScore % 10);
    DrawCharacter(1,10,TensScore/10);
  }
 // Draw rightmost digit
  DrawCharacter(1,14,Score % 10);
 // Draw "leftmost" digit, if necessary
  if(Score>99) {
    HundredScore = Score % 1000;
    HundredScore = HundredScore - (HundredScore % 100);
    DrawCharacter(1,6, HundredScore / 100);
  }
}

//LKS - used for debugging
function UpdateStatus() {
  var s = Score;
  s = s + "; ms = " + MouseSensitivity;
  defaultStatus = s;
}

