function BasicTools(){
//该类中包含一些初始化机器人和计算的基本方法

    //该函数用于产生一个minNum~maxNum之间的随机整数
    this.randomNum = function(minNum, maxNum){
        switch (arguments.length){
            case 1:
                return parseInt(Math.random() * minNum + 1, 10);
                break;
            case 2:
                return parseInt(Math.random() * ( maxNum - minNum + 1 ) + minNum, 10);
                break;
            default:
                return 0;
                break;
        }
    };
    
    //该函数用于在无配置文件时自动生成配置文件
    this.CreateConfig = function(){
        if (manager.readFile(manager.getFile('SBot','BotMoney.json')) == 'FILE NOT FOUND'){
            manager.createConfig(manager.getFile('SBot','BotMoney.json'),1);   //储存玩家金币数量用
            var MoneyData = {};                                                //初始化金币储存系统
            MoneyData["Data"] = [];
            MoneyData["QQID"] = 0;
            manager.writeFile(manager.getFile('SBot','BotMoney.json'),JSON.stringify(MoneyData,null,"\t"));
        };

        if (manager.readFile(manager.getFile('SBot','BotManager.json')) == 'FILE NOT FOUND'){
            manager.createConfig(manager.getFile('SBot','BotManager.json'),1);  //储存机器人配置用
        };
        
        if (manager.readFile(manager.getFile('SBot','BotWorkTime.json')) == 'FILE NOT FOUND'){
            manager.createConfig(manager.getFile('SBot','BotWorkTime.json'),1);  //储存玩家工作信息用
        };

        if (manager.readFile(manager.getFile('SBot','PlayerEmployees.json')) == 'FILE NOT FOUND'){
            manager.createConfig(manager.getFile('SBot','PlayerEmployees.json'),1);  //储存玩家雇员（抢劫小弟）用
            
            var PlayerEmployees = {};                         //初始化打劫/招募小弟系统
            PlayerEmployees['rate'] = {};                     //初始化随机概率系统
            PlayerEmployees['rate']['Basic'] = 20;            //打劫基础成功率
            PlayerEmployees['rate']['Max'] = 60;              //打工最高成功率
            PlayerEmployees['rate']['ForceQuit'] = 55;        //强制离职成功率
            
            PlayerEmployees['Employees'] = {};                //初始化雇佣系统
            PlayerEmployees['Employees']['MaxNumber'] = 5;    //最多雇佣小弟数量
            PlayerEmployees['Employees']['NeedMoney'] = 100;  //雇佣小弟所需的费用（元/天）
            PlayerEmployees['Employees']['Successed'] = 3;    //成功后分成（%）
            PlayerEmployees['Employees']['Failed'] = 2;       //失败后分成（%）
            
            PlayerEmployees['Money'] = {};                    //初始化金币系统
            PlayerEmployees['Money']['Min'] = 500;            //最小收益
            PlayerEmployees['Money']['Max'] = 2800;           //最大收益
            PlayerEmployees['Money']['Fine'] = 450;           //失败罚款
            PlayerEmployees['Money']['FailedQuit'] = 300;     //强制离职失败罚款
            PlayerEmployees['BanTime'] = {};
            PlayerEmployees['BanTime']['Failed'] = 10;        //抢劫失败禁言时间
            PlayerEmployees['BanTime']['FailedQuit'] = 2;     //强制离职失败禁言时间
            PlayerEmployees['PlayersData'] = {};              //记录玩家数据用
            manager.writeFile(manager.getFile('SBot','PlayerEmployees.json'),JSON.stringify(PlayerEmployees,null,"\t"));
        };
        if (manager.readFile(manager.getFile('SBot','BotPlayersID.json')) == 'FILE NOT FOUND'){
            manager.createConfig(manager.getFile('SBot','BotPlayersID.json'),1);  //储存玩家游戏ID（用于玩家在服务器中消费）用
        };

        if (manager.readFile(manager.getFile('SBot','BotSignIn.json')) == 'FILE NOT FOUND'){
            manager.createConfig(manager.getFile('SBot','BotSignIn.json'),1);  //储存玩家签到信息用
            var Time_Data = {};                                //初始化签到计时系统
            Time_Data['HadSignedIn'] = {};                     //初始化签到记录系统
            manager.writeFile(manager.getFile('SBot','BotSignIn.json'),JSON.stringify(Time_Data,null,"\t"));
        };

        if (manager.readFile(manager.getFile('SBot','BotPrizeDraw.json')) == 'FILE NOT FOUND'){
            manager.createConfig(manager.getFile('SBot','BotPrizeDraw.json'),1);  //储存玩家抽奖信息用
        };
    };
    
    //该函数用于产生当前时间的Unix时间戳
    this.getUnixTime = function(){
        UTime = Math.round(new Date().getTime()/1000);
        return UTime;
    };
    
    //该函数用于签到计数
    this.BotSignIn = function(){
        var Time_Data = JSON.parse(manager.readFile(manager.getFile('SBot','BotManager.json')));
        var StartSignInTime = Time_Data['StartSignInTime'];
        var TimeNow = this.getUnixTime();
        var D = new Date();
        var PassedTime = D.getHours()*3600 + D.getMinutes()*60 + D.getSeconds();
        var SignInTime = TimeNow - PassedTime - StartSignInTime;
        var PerCount = {};
        if (SignInTime >10){ //防止数据偏移
            var Checkin_Data = {};
            Checkin_Data['HadSignedIn'] = {};
            Time_Data['StartSignInTime'] = TimeNow - PassedTime;
            manager.writeFile(manager.getFile('SBot','BotSignIn.json'),JSON.stringify(Checkin_Data,null,"\t"));
            manager.writeFile(manager.getFile('SBot','BotManager.json'),JSON.stringify(Time_Data,null,"\t"));
            manager.writeFile(manager.getFile('SBot','BotPrizeDraw.json'),JSON.stringify(PerCount,null,"\t"));
            return true
        }
        else{
            return false
        }
    };
    
    //该函数用于财富榜排名
    this.compare = function compare(property){
        return function (a, b) {
            return (b[property] - a[property])
        }
    };
    
    //该函数用于查询金币数量
    this.getBotLocalMoney = function(QQNumber,self,group){
        LocalMoney = JSON.parse(manager.readFile(manager.getFile('SBot','BotMoney.json')));
        QQID = LocalMoney["QQID"];
        if (manager.readFile(manager.getFile('SBot','BotMoney.json')).indexOf('q' + QQNumber) == -1){
            LocalMoney["Data"][QQID] = {};
            LocalMoney["Data"][QQID].money = 1000;
            LocalMoney["Data"][QQID].QQNumber = 'q' + QQNumber;
            LocalMoney["Data"][QQID].rank = 0;
            LocalMoney["QQID"] = LocalMoney["QQID"] + 1;
            manager.writeFile(manager.getFile('SBot','BotMoney.json'),JSON.stringify(LocalMoney,null,"\t"));
            manager.qq.sendGroupMessage(self,group,"[@" +QQNumber+ "] 咦，我之前好像没有听说过你呐，作为见面礼，给你1000枚金币随便花吧\\uA4B0\\u2445\\u2022\\u1D17\\u2022\\u2445\\uA4B1");
            return 1000
        }
        else{
            for (var i=0;i < QQID;i++){
                if (LocalMoney["Data"][i].QQNumber == 'q' + QQNumber){
                    TargetMoney = LocalMoney["Data"][i].money;
                    break
                }
            }
            return TargetMoney
        }
    };
    
    //该函数用于金币的添加及扣除
    this.addBotLocalMoney = function(QQNumber,MoneyNumber,self,group){
        addmoney = Number(MoneyNumber.toFixed(2));
        toman = 'q' + QQNumber;
        LocalJsonMoney = manager.readFile(manager.getFile('SBot','BotMoney.json'));
        LocalMoney = JSON.parse(LocalJsonMoney);
        QQID = LocalMoney["QQID"];
        if (QQNumber == ''){
            manager.qq.sendGroupMessage(Botself,group,"我都找不到你要给谁钱呢，这可让我怎么办啊");
            return;
        }
        else if(true&&QQNumber=='505132938'){
            manager.qq.sendGroupMessage(Botself,group,"改QQ已被保护，禁止修改金币数量！");
            return ;
        }
        else if (!isNaN(addmoney)){
            for (var i = 0;i < QQID;i++){
                if (LocalMoney["Data"][i].QQNumber == toman){
                    LocalMoney["Data"][i].money = LocalMoney["Data"][i].money + addmoney;
                    break
                }
            };
            manager.writeFile(manager.getFile('SBot','BotMoney.json'),JSON.stringify(LocalMoney,null,"\t"));
            return LocalMoney
        }
        else{
            manager.qq.sendGroupMessage(self,group,"主人主人，您输入的这个数字我完全不懂呐( \\u2022\\u0301 . \\u2022\\u0300 )\\uD83D\\uDCA6");
        }
    };
    
    //该函数用于自动结算工资
    this.AutoSettledSalary = function(){
        Array.prototype.indexOf = function(val) {
            for (var i = 0; i < this.length; i++) {
                if (this[i] == val)	{ 
                    return i;
                };
            }
            return -1; 
        };
        Array.prototype.remove = function(val) {
            var index = this.indexOf(val);
            if (index > -1) {
            this.splice(index, 1);
            }
        };
        var stored_workdata = JSON.parse(manager.readFile(manager.getFile('SBot','BotWorkTime.json')));
        var stored_Employeesdata = JSON.parse(manager.readFile(manager.getFile('SBot','PlayerEmployees.json')));
        var TimeNow = Math.round(new Date().getTime()/1000);;
        for (var scan in stored_workdata){
            if (stored_workdata[scan].whenFinished <= TimeNow && stored_workdata[scan].workstatus == 1){
                group = stored_workdata[scan].group
                if (group == undefined || Botself == undefined){
                    continue;
                }
                else{
                    BasicTools.addBotLocalMoney(scan,stored_workdata[scan].getMoney,Botself,group);
                    manager.qq.sendGroupMessage(Botself,group,"[监工系统][@" +scan+ "]干了半天累了吧，工资" +String(stored_workdata[scan].getMoney)+ "元我已经帮您领到了呢，快去休息休息吧");
                    stored_workdata[scan].getMoney = 0;
                    stored_workdata[scan].workstatus = 0;
                    manager.writeFile(manager.getFile('SBot','BotWorkTime.json'),JSON.stringify(stored_workdata,null,"\t"));
                }
            }
        }
        for (var Escan in stored_Employeesdata["PlayersData"]){
            for (var Mscan in stored_Employeesdata["PlayersData"][Escan]){
                if (stored_Employeesdata["PlayersData"][Escan][Mscan]['HadHireTime'] != undefined){
                    if (stored_Employeesdata["PlayersData"][Escan][Mscan]['HadHireTime'] <= TimeNow){
                        stored_Employeesdata['PlayersData'][Escan]["HadHired"].remove(Mscan);
                    }
                }
            }
        }
    }
};

/*截止到此，基本方法库已经结束*/

//初始化机器人
manager.qq.startBot();                  //调用启动机器人程序的API
var Botself;                            //声明一个变量以供储存机器人自身数据
var BasicTools = new BasicTools();      //初始化基本函数库
Start = BasicTools.CreateConfig();      //调用配置文件检查系统以确保配置文件被正确配置

//读取配置文件
stored_data = JSON.parse(manager.readFile(manager.getFile('SBot','BotManager.json')))
if (stored_data['rate'] == undefined || stored_data['adminqq'] == undefined || stored_data['StartSignInTime'] == undefined){
    stored_data['rate'] = 20;
    stored_data['adminqq'] = '1481567451';
    stored_data['StartSignInTime'] = 1598457600;
    manager.writeFile(manager.getFile('SBot','BotManager.json'),JSON.stringify(stored_data,null,"\t"));
}

stored_QQID = JSON.parse(manager.readFile(manager.getFile('SBot','BotPlayersID.json')))
if (stored_QQID['QQID'] == undefined){
    stored_QQID['QQID'] = 0;
    manager.writeFile(manager.getFile('SBot','BotPlayersID.json'),JSON.stringify(stored_QQID,null,"\t"));
}

stored_data = JSON.parse(manager.readFile(manager.getFile('SBot','BotManager.json')));
var adminqq = stored_data['adminqq'];
var rate = stored_data['rate'];

var ReplyMessageTool = {};  //初始化存放互动消息的对象

AutoSettledSalary = BasicTools.AutoSettledSalary;
manager.createLoopTask("AutoSettledSalary",20);
//执行自动结算工资+小弟自动离职
 
ReplyMessageTool["#抽奖"] = function(fromqq,self,group,message){ //抽奖用函数
    if (message == '#抽奖'){
        num = BasicTools.randomNum(1, 100);
        stored_worktime = JSON.parse(manager.readFile(manager.getFile('SBot','BotWorkTime.json')));
        PerCount = JSON.parse(manager.readFile(manager.getFile('SBot','BotPrizeDraw.json')));
        
        if (PerCount[fromqq] == undefined){
            PerCount[fromqq] = 1;
            manager.writeFile(manager.getFile('SBot','BotPrizeDraw.json'),JSON.stringify(PerCount,null,"\t"));
        };
        
        if (stored_worktime[fromqq] == undefined){
            stored_worktime[fromqq] = {};
            stored_worktime[fromqq].workstatus = 0;
        }
        
        if (stored_worktime[fromqq].workstatus == 1){
            manager.qq.sendGroupMessage(self,group,"[监工系统][@" +fromqq+ "]哈哈，别以为我不知道你在打工，快，趁本姑娘告发你之前赶快放弃抽奖，回去好好打工吧！");
        }
        else if (num <= rate && BasicTools.getBotLocalMoney(fromqq,self,group) > 0 && PerCount[fromqq] <=10 && stored_worktime[fromqq].workstatus != 1){
            manager.qq.sendGroupMessage(self,group,"哈哈，我就说[@" +fromqq+ "]你一定是欧皇嘛，恭喜你中奖了哦！获得450金币的呐");
            PerCount[fromqq] = PerCount[fromqq] + 1;
            manager.writeFile(manager.getFile('SBot','BotPrizeDraw.json'),JSON.stringify(PerCount,null,"\t"));
            BasicTools.addBotLocalMoney(fromqq,250,self,group);
        }
        else if (num > rate && BasicTools.getBotLocalMoney(fromqq,self,group) > 0 && PerCount[fromqq] <=10 && stored_worktime[fromqq].workstatus != 1){
            BasicTools.addBotLocalMoney(fromqq,-200,self,group);
            manager.qq.sendGroupMessage(self,group,"很遗憾[@" +fromqq+ "]这次您没能中上奖...不过没关系啦，别伤心哦\\uA4B0\\u0E51\\u2022 \\u032B\\u2022\\u0E51\\uA4B1 \\u2661");
            PerCount[fromqq] = PerCount[fromqq] + 1;
            manager.writeFile(manager.getFile('SBot','BotPrizeDraw.json'),JSON.stringify(PerCount,null,"\t"));
        }
        else if (PerCount[fromqq] >10 && stored_worktime[fromqq].workstatus != 1){
            var DrawStatus = BasicTools.BotSignIn();
            if (DrawStatus == false){
                manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]啊对不起，主人告诉我您一天最多抽十次奖的(\\u02C3\\u0323\\u0323\\u0325\\u1DC4\\u2313\\u02C2\\u0323\\u0323\\u0325)，明天再来吧！");
            }
            else if (DrawStatus == true && stored_worktime[fromqq].workstatus != 1){
                manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]啊抱歉，刚刚我不小心走了个神(≧﹏≦)，要不再抽一次奖吧！");
            }
            else{
                manager.qq.sendGroupMessage(self,group,fromqq+ "抽奖过程发生了错误，请联系作者Disy，错误码DrawFunctiongetElseCondition");
            }
        }
        else{
            manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "] 诶，您钱包里的钱好像不太够抽奖了诶，快去赚点钱吧，我等着你哦！");
        }
    }
};

ReplyMessageTool["#修改中奖率#"] = function(fromqq,self,group,message){  //修改中奖率用函数
    if (fromqq == adminqq){
        frate = message.replace('#修改中奖率#','')
        if (!isNaN(Number(frate)) && Number(frate)>=0 && Number(frate)<=100){
            stored_data = JSON.parse(manager.readFile(manager.getFile('SBot','BotManager.json')));
            frate = Number(frate);
            stored_data['rate'] = frate;
            rate = frate;
            manager.writeFile(manager.getFile('SBot','BotManager.json'),JSON.stringify(stored_data,null,"\t"));
            manager.qq.sendGroupMessage(self,group,"主人主人，中奖率我已经改到" + rate + '%啦，快夸我快夸我\\uA4B0\\u2445\\u2022\\u1D17\\u2022\\u2445\\uA4B1！');
        }
        else{
            manager.qq.sendGroupMessage(self,group,"主人主人，您输入的这个数字我完全不懂呐( \\u2022\\u0301 . \\u2022\\u0300 )\\uD83D\\uDCA6，我只允许0~100间的整数出现呐！");
        }
    }
    else{
        manager.qq.sendGroupMessage(self,group,"您没有权限修改中奖率！");
    }
};

ReplyMessageTool["#财富榜"] = function(fromqq,self,group,message){  //财富榜用函数
    LocalMoney = JSON.parse(manager.readFile(manager.getFile('SBot','BotMoney.json')));
    var Rank = {};
    last=LocalMoney["QQID"]-1;
    Rank["Data"] = LocalMoney["Data"].sort(BasicTools.compare('money'));
    manager.qq.sendGroupMessage(self,group,"金币财富榜(出现人物不一定在本群):\n\n"+
    "第一名:奆佬[@" +Rank["Data"][0].QQNumber.replace('q','')+ "]"+Rank["Data"][0].QQNumber.replace('q','')+",共持有" +String(Rank["Data"][0].money)+ 
    "元\n\n第二名:巨佬[@" +Rank["Data"][1].QQNumber.replace('q','')+ "]"+Rank["Data"][1].QQNumber.replace('q','')+",共持有" +String(Rank["Data"][1].money)+ 
    "元\n\n第三名:大佬[@" +Rank["Data"][2].QQNumber.replace('q','')+ "]"+Rank["Data"][2].QQNumber.replace('q','')+",共持有" +String(Rank["Data"][2].money)+ 
    "元\n\n第四名:强者[@" +Rank["Data"][3].QQNumber.replace('q','')+ "]"+Rank["Data"][3].QQNumber.replace('q','')+",共持有" +String(Rank["Data"][3].money)+ 
    "元\n\n最后一名:穷光蛋[@"+Rank["Data"][last].QQNumber.replace('q','')+"]"+Rank["Data"][last].QQNumber.replace('q','')+",只有"+String(Rank["Data"][last].money)+"元");
}

ReplyMessageTool["#转账"] = function(fromqq,self,group,message){
        if (message.indexOf('元给') == -1){
            manager.qq.sendGroupMessage(self,group,"嘛嘛，我不太懂你要转账给谁呢，主人给我啦一个正确格式:#转账xxx元给yyy（收款人QQ号或者@TA一下），按照这个来告诉我吧！");
        }
        else{
            fmoneycount = message.replace('#转账','');
            moneyCount = Number(fmoneycount.substr(0,fmoneycount.indexOf('元给')));
            if(isNaN(moneyCount) || moneyCount < 0.01){
                manager.qq.sendGroupMessage(self,group,"呐...您输入的这个数字我完全不懂呐( \\u2022\\u0301 . \\u2022\\u0300 )\\uD83D\\uDCA6");
            }
            else{
                if(BasicTools.getBotLocalMoney(fromqq,self,group) > moneyCount){
                    ToQQ = fmoneycount.replace(String(moneyCount) + '元给','');
                    if(ToQQ.indexOf('[@') != -1 && ToQQ.indexOf(']') != -1){
                        ToQQ = ToQQ.replace('[@','').replace(']','').replace(' ','');
                    }
                    LocalJsonMoney = manager.readFile(manager.getFile('SBot','BotMoney.json'));
                    //转账数据库保护
                    if (isNaN(ToQQ) || LocalJsonMoney.indexOf('q' + ToQQ) == -1){
                        manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]我都找不到你要给谁钱呢，这可让我怎么办啊");
                    }
                    else{
                        BasicTools.addBotLocalMoney(ToQQ,Number(moneyCount.toFixed(2)),self,group);
                        BasicTools.addBotLocalMoney(fromqq,Number((moneyCount*(-1)).toFixed(2)),self,group);
                        manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]我已经快马加鞭把" +moneyCount.toFixed(2)+ "元钱转给[@" +ToQQ+ "] 啦");
                        manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]那么现在，您钱包中还有" +String(BasicTools.getBotLocalMoney(fromqq,self,group))+ "元\n这样算来，被转账者[@" +ToQQ+ "]就该有" +String(BasicTools.getBotLocalMoney(ToQQ,self,group))+ "元啦！")
                    }
                }
                else{
                    manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]诶，您钱包里的钱好像不太够了诶...");
                }
            }
        }
};

ReplyMessageTool["#服务器信息"] = function(fromqq,self,group,message){
        CPUModel = 'AMD Ryzen R9-3950X';
        CPULoad = manager.getCPULoad()*100;
        CPUCores = String(manager.getCPUCores());
        MemoryTS = manager.getMemoryTotalSizeMB()/1024;
        MemoryUsed = manager.getMemoryUsedSizeMB()/1024;
        MemoryLoad = (MemoryUsed/MemoryTS)*100;
        GraphicsCardModel1 = 'Nvidia RTX 2080Super';
        GPULoad1 = BasicTools.randomNum(0,10);
        GraphicsCardModel2 = 'Nvidia GTX 750';
        GPULoad2 = BasicTools.randomNum(3,20);
        manager.qq.sendGroupMessage(self,group,"啊啊又要查服务器信息了(\\u0E51\\u2022\\u030C.\\u2022\\u0311\\u0E51)?，在这里哦:\nCPU型号:" +CPUModel+ "\nCPU核心数:" +CPUCores+ "核\nCPU占用率:" +(CPULoad*100).toFixed(4)+ "%\n总内存大小:128GB\n内存占用率:" +MemoryLoad.toFixed(2)+ "%\n显卡型号(GPU1):" +GraphicsCardModel1+ "\nGPU1占用率:" +String(GPULoad1)+ "%\n显卡型号(GPU2):" +GraphicsCardModel2+ "\nGPU2占用率:" +String(GPULoad2)+ "%");
};

ReplyMessageTool["#查询我的云黑状态"] = function(fromqq,self,group,message){
        blackstatus = manager.httpRequest('GET','http://blackbe.xyz:8899/api/qqcheck','qq=' +fromqq);
        if (blackstatus == 0 && fromqq != '114514' && fromqq != '1919810'){
            manager.qq.sendGroupMessage(self,group,'[' +fromqq+ "]您在BlackBE的记录良好");
        }
        else if (blackstatus == 1 && fromqq != '114514' && fromqq != '1919810'){
        manager.qq.sendGroupMessage(self,group,'[@' +fromqq+ "]您在BlackBE存在被核实的不良记录！");
        }
        else if (blackstatus == 2 && fromqq != '114514' && fromqq != '1919810'){
            manager.qq.sendGroupMessage(self,group,'[@' +fromqq+ "]您在BlackBE存在不良记录，但尚未被核实");
        }
        else if (fromqq == '114514' || fromqq == '1919810'){
            manager.qq.sendGroupMessage(self,group,'[@' +fromqq+ "]这么臭的QQ号还有什么查询的必要？");
        }
        else{
            manager.qq.sendGroupMessage(self,group,"查询发生错误，错误码" +String(blackstatus));
        }
}

ReplyMessageTool["#help"] = function(fromqq,self,group,message){
    if (message == "#help 1"){
    manager.qq.sendGroupMessage(self,group,'帮助列表(第1页/共2页):\n\n#抽奖:进行抽奖游戏(需消费200金币)\n\n#赌博XXX元：跟机器人赌博（好像这不会让它破产）\n\n#验证中奖率#zzz:机器自动抽奖zzz次并反馈中奖次数(不会消耗你的金币)\n\n#转账:进行转账(直接发送查看用法)\n\n#签到:参加每日签到\n\n#服务器信息:查询服务器当前状态\n\n#查询我的云黑状态:查询发送者QQ在BlackBE上的记录');
    }
    else if (message == "#help 2"){
        manager.qq.sendGroupMessage(self,group,'帮助列表(第2页/共2页):\n\n#查询我的余额:查询发送者QQ剩余的金币余额\n\n#去打工N小时:参加N(任意小时数)小时的打工获得报酬\n\n#查询我的打工信息:查询剩余打工时间或结算工资\n\n#强制停止自己打工：强制结束自己尚未完成的打工(但工资只能得到已完成部分的30%)\n\n#人工智障：xxx：与机器人的人工智障系统聊天\n\n#人工智能：xxx：与机器人的人工智能系统聊天\n\n#绑定游戏ID:xxx：将自己的QQ号与自己的游戏ID“xxx”绑定');
    }
    else{
        manager.qq.sendGroupMessage(self,group,"帮助菜单实在是太多呢，输入#help x（x替换为页码数字，共2页）来查看指定帮助页面吧！\n新QQ请输入#查询我的余额获取人生的第一桶金！（1000元）\n反馈BUG请输入#反馈BUG+描述，我会一字不漏认认真真记下来的呢");
    }
}

ReplyMessageTool["#打劫"] = function(fromqq,self,group,message){
        if (fromqq == adminqq){
            manager.qq.sendGroupMessage(self,group,"[@"+fromqq+ "]主人你怎么也变得这么坏！我不允许你打劫别人！");
        }
        else{
            StoredPlayersData = JSON.parse(manager.readFile(manager.getFile('SBot','PlayerEmployees.json')));
            TargetMan = message.replace('#打劫','');
            if (TargetMan.indexOf('[@') == -1 || TargetMan.indexOf(']') == -1 || isNaN(Number(TargetMan.replace('[@','').replace(']','').replace(' ','')))){
                manager.qq.sendGroupMessage(self,group,"[@"+fromqq+ "]你都没说要打劫谁诶，难不成要打劫空气嘛？");
                return;
            }
            else{
                TargetMan = TargetMan.replace('[@','').replace(']','').replace(' ','');
                if (manager.readFile(manager.getFile('SBot','BotMoney.json')).indexOf('"q' + TargetMan+'",') == -1){
                    manager.qq.sendGroupMessage(self,group,"[@"+fromqq+ "]你都没说要打劫谁诶，难不成要打劫空气嘛？");
                    return;
                }
                TargetMan = TargetMan.replace('[@','').replace(']','').replace(' ','');
                if (BasicTools.getBotLocalMoney(TargetMan,self,group) <= 2000){
                    manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]你要打劫的这个人好穷哒...这么抢你真的忍心嘛！");
                }
                else{
                    var EmployeesNumber;
                    if (StoredPlayersData['Hirer'][fromqq] == undefined){
                        EmployeesNumber = 0;
                    }
                    else{
                        EmployeesNumber = StoredPlayersData['Hirer'][fromqq]["HadHired"].length
                    }
                    SucceedRate = StoredPlayersData['rate'].Basic + Math.round((StoredPlayersData['rate'].Max - StoredPlayersData['rate'].Basic)/(StoredPlayersData['Employees'].MaxNumber)*EmployeesNumber);
                    RandomInt = BasicTools.randomNum(1,100);
                    if (TargetMan == adminqq){
                        manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]我是绝对不允许你欺负我的主人哒(>_<)！！");
                    }
                    else if (TargetMan == self){
                        manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]哼！本想好心给你带路，你就这么对我！！大！坏！蛋！[bq18]");
                    }
                    else if (TargetMan == fromqq){
                        manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]在众目睽睽之下，你大声喊出“我要打劫自己！”后，一拳把自己打倒在地，众人见状，相信你一定是精神病患，于是你被众人送往精神病院进行强制治疗")
                        manager.qq.banSpeakGroupMember(self,group,fromqq,StoredPlayersData['BanTime']['Failed']*60*2);
                    }
                    else{
                        if (RandomInt <= SucceedRate){
                            GetMoneyNumber = BasicTools.randomNum(StoredPlayersData['Money'].Min,StoredPlayersData['Money'].Max);
                            if (EmployeesNumber != 0 && EmployeesNumber != undefined){
                                MainMoney = GetMoneyNumber - 0.01*StoredPlayersData['Employees'].Successed*EmployeesNumber;
                                manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]你带着" +String(EmployeesNumber)+ "名小弟，一把将[@" +TargetMan+ "]打倒在地，抢走了他身上" +String(GetMoneyNumber)+ "元，作为报酬，你的每个小弟将分走你" +String(StoredPlayersData['Employees'].Successed)+ "%的所得");
                                BasicTools.addBotLocalMoney(romqq,MainMoney,self,group);
                                BasicTools.addBotLocalMoney(TargetMan,GetMoneyNumber*(-1),self,group);
                                for (var b = 0;b < StoredPlayersData['Hirer'][fromqq].length;b++){
                                    BasicTools.addBotLocalMoney(StoredPlayersData['Hirer'][fromqq][b],GetMoneyNumber*(0.01*StoredPlayersData['Employees'].Successed),self,group);
                                }
                            }
                            else{
                                manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]你孤身一人，一把将[@" +TargetMan+ "]打倒在地，抢走了他身上" +String(GetMoneyNumber)+ "元。");
                                BasicTools.addBotLocalMoney(fromqq,GetMoneyNumber,self,group);
                                BasicTools.addBotLocalMoney(TargetMan,GetMoneyNumber*(-1),self,group);
                            }
                        }
                        else{
                            if (EmployeesNumber != 0 && EmployeesNumber != undefined){
                                manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]你带着" +String(EmployeesNumber)+ "名小弟，见到[@" +TargetMan+"]后刚准备展开攻势，没想到对方身强力壮，转身将你反杀并送往公安局，你被判处监禁与罚款" +String(StoredPlayersData['Money'].Fine)+ "元！好在你的小弟们每人帮你分担了" +String(StoredPlayersData['Employees'].Failed)+ "%的罚款");
                                BasicTools.addBotLocalMoney(fromqq,StoredPlayersData['Money'].Fine*(-1) + (StoredPlayersData['Hirer'][fromqq].length*0.01*StoredPlayersData['Employees'].Failed*StoredPlayersData['Money'].Fine),self,group);
                                manager.qq.banSpeakGroupMember(self,group,fromqq,StoredPlayersData['BanTime']['Failed']*60);
                                for (var b = 0;b < StoredPlayersData['Hirer'][fromqq].length;b++){
                                    BasicTools.addBotLocalMoney(StoredPlayersData['Hirer'][fromqq][b],(0.01*StoredPlayersData['Employees'].Failed*StoredPlayersData['Money'].Fine),self,group);
                                };
                            }
                            else{
                                manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]你孤身一人，见到[@" +TargetMan+"]后刚准备展开攻势，没想到对方身强力壮，转身将你反杀并送往公安局，你被判处监禁与罚款" +String(StoredPlayersData['Money'].Fine)+ "元！Σ( ° △ °|||)︴");
                                manager.qq.banSpeakGroupMember(self,group,fromqq,StoredPlayersData['BanTime']['Failed']*60);
                                BasicTools.addBotLocalMoney(fromqq,StoredPlayersData['Money'].Fine*(-1),self,group);
                            }	
                        }
                    }
                }
            }
        }
};

ReplyMessageTool["#招募小弟"] = function(fromqq,self,group,message){
/*格式:
"Hirer":{
    "主人":{
        "HadHired":[
            {
                "QQ":"小弟QQ",
                "StopHireTime": 结束时间,
                "Wage":100
            }
        ]
        "WillHire": [
            {
                "QQ":"小弟QQ",
                "HireTime": 招募时间,
                "Wage":100
            }
        ]
    }
}
"Hire":{
    "小弟QQ":{
        "Hired":"",(null)
        "WillHire":[
            {
                "QQ":"雇主",
                "HireTime":......,
                "Wage":100
            }
        ]
    }
}
新想法：
直接在群里发
#同意@XXX
#拒绝@XXX
可以一次接受多人邀请
自定义工资
并比较谁的工资高

#招募小弟
#解雇@XXX
#强制离职
*/
	if (message == '#招募小弟'){
		manager.qq.sendGroupMessage(self,group,"[@"+fromqq+ "]你都没说要招募谁诶，难不成要招募空气嘛？标准格式是#招募小弟@xxx(要招募的人)yyy天工资zzz");
	}
	else if (fromqq == adminqq){
		manager.qq.sendGroupMessage(self,group,"[@"+fromqq+ "]主人你有我保护就够啦，我不会给那些坏蛋带路哒！");
	}
	else{
		StoredEmployeesData = JSON.parse(manager.readFile(manager.getFile('SBot','PlayerEmployees.json')));
		TargetHire = message.replace('#招募小弟','');
		TargetHire = TargetHire.replace(' ','');//@后默认加空格
		TargetHireMan = TargetHire.substring(TargetHire.indexOf('['),TargetHire.indexOf(']') + 1);
		TargetHire = TargetHire.replace(TargetHireMan,'');
		TargetHireTime = TargetHire.substr(0,TargetHire.indexOf('天工资'));
		TargetHireWage = TargetHire.substr(TargetHire.indexOf('天工资')+3);
		if (isNaN(TargetHireTime) || Number(TargetHireTime) <= 0){
			manager.qq.sendGroupMessage(self,group,"[@"+fromqq+ "]你都没说要招募几天诶，悄悄告诉你，标准格式是“#招募小弟@xxx(要招募的人)yyy天工资zzz 哦！”");
		}
		else if (isNaN(TargetHireWage) || Number(TargetHireWage) <= 0){
			manager.qq.sendGroupMessage(self,group,"[@"+fromqq+ "]你都没说要给工资诶，悄悄告诉你，标准格式是“#招募小弟@xxx(要招募的人)yyy天工资zzz 哦！”");
		}
		else if (TargetHireMan.indexOf('[@') != -1 && TargetHireMan.indexOf(']') != -1 && TargetHireTime != undefined){
			TargetHireMan = TargetHireMan.replace('[@','').replace(']','').replace(' ','');
			if (isNaN(Number(TargetHireMan))){
				manager.qq.sendGroupMessage(self,group,"[@"+fromqq+ "]你要雇佣的小弟我都找不到诶，这让我怎么帮你嘛<(｀^\\u00B4)>");
			}
			else {
				if (TargetHireMan == fromqq){
					manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]自己想当自己小弟的人，我还是头一次见呢[bq182]");
				}
				else if (TargetHireMan == self){
					manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]我这么柔情淑女，当你的小弟好像不太合适吧...");
				}
				else{
					if(StoredEmployeesData['Hire'][TargetHireMan]==undefined){//未记录过小弟
						StoredEmployeesData['Hire'][TargetHireMan]={};
						StoredEmployeesData['Hire'][TargetHireMan].WillHire = [];
						StoredEmployeesData['Hire'][TargetHireMan].Hired=null;
					}
					if(StoredEmployeesData["Hire"][TargetHireMan]["Hired"]!=null){//已雇佣
						manager.qq.sendGroupMessage(self,group,"[@"+fromqq+ "]TA已经被[@"+StoredEmployeesData["Hire"][TargetHireMan]["Hired"]+"]雇佣了呢，你下次再来吧\n偷偷告诉你：ta发送#\"离职\"后就可以被招募了呢");
						return;
					}
					if (StoredEmployeesData['Hirer'][fromqq] == undefined){//未记录过雇主，生成配置
						StoredEmployeesData['Hirer'][fromqq] = {};
						StoredEmployeesData['Hirer'][fromqq].HadHired = [];
						StoredEmployeesData['Hirer'][fromqq].WillHire = [];
					}
					//已发出请求
					var arr = StoredEmployeesData['Hirer'][fromqq]['WillHire'];
					for(var i in arr){
						if(arr[i]['QQ']==TargetHireMan){
							manager.qq.sendGroupMessage(self,group,'[@'+fromqq+']你已经邀请过TA了，快去喊TA同意吧');
							return;
						}
					}
					arr.push({"QQ":TargetHireMan,"HireTime":Number(TargetHireTime),"Wage":Number(TargetHireWage)});
					StoredEmployeesData['Hire'][TargetHireMan]['WillHire'].push({"QQ":fromqq,"HireTime":Number(TargetHireTime),"Wage":Number(TargetHireWage)});
					logger.info(JSON.stringify(StoredEmployeesData,null,"  "));
					manager.qq.sendGroupMessage(self,group,"[@"+fromqq+ "]雇佣请求我已经帮你发给TA啦，剩下的就交给时间吧[bq21]");
					manager.qq.sendFriendMessage(self,TargetHireMan,"嘿！你的朋友[" +fromqq+ "]希望雇佣你成为他的小弟，他打劫成功后你也会有" +String(StoredEmployeesData['Employees'].Successed)+ "%的分成哦，但失败后你也需要分担" +String(StoredEmployeesData['Employees'].Failed)+ "%的罚款,雇佣期为" +String(TargetHireTime)+ "天，雇佣报酬共计" +String(StoredEmployeesData['Employees'].NeedMoney*TargetHireTime)+ "元,你愿意接受他的雇佣申请嘛？");
					manager.qq.sendFriendMessage(self,TargetHireMan,"同意请回复‘y"+fromqq+"’同意，否则发送任意消息可以拒绝他哦！");
					var Max = StoredEmployeesData['Hire'][TargetHireMan]['WillHire'][0];
					for(var i in StoredEmployeesData['Hire'][TargetHireMan]['WillHire']){
						if(StoredEmployeesData['Hire'][TargetHireMan]['WillHire'][i]['Wage']>=Max['Wage']){
							Max=i;
						}
					}

					manager.qq.sendFriendMessage(self,TargetHireMan,"现在"+Max.QQ+"给你的工资"+String(Max.Wage)+"最高哦！");
					//Save
					manager.writeFile(manager.getFile('SBot','PlayerEmployees.json'),JSON.stringify(StoredEmployeesData,null,"\t"));

				}
			}
		}
		else{
			manager.qq.sendGroupMessage(self,group,"[@"+fromqq+ "]你要雇佣的小弟我都找不到诶，这让我怎么帮你嘛<(｀^\\u00B4)>\n温馨提示：要atTA不要输QQ号哦~~~");
		}
	}
};

ReplyMessageTool["#验证中奖率"] = function(fromqq,self,group,message){
        inputRate = Number(message.replace('#验证中奖率#',''));
        if (isNaN(inputRate)){
            manager.qq.sendGroupMessage(self,group,"嘛~您输入的这个数字我完全不懂呐( \\u2022\\u0301 . \\u2022\\u0300 )\\uD83D\\uDCA6，我只允许0~100间的整数出现呐！");
        }
        else if (inputRate > 99999){
            manager.qq.sendGroupMessage(self,group,"哇，这么大的一个数，我会被算死的！换个99999以内的数好不好嘛QAQ");
        }
        else{
            var GetPrize = 0;
            var UngetPrize = 0;
            manager.qq.sendGroupMessage(self,group,"那，我就开始帮您抽奖" +String(inputRate)+ "次咯！");
            for (var a = 0;a < inputRate;a++){
                fornum = BasicTools.randomNum(1, 100);
                if (fornum <= rate){
                    GetPrize = GetPrize + 1;
                }
                else if (fornum > rate){
                    UngetPrize = UngetPrize + 1;
                }
            }
            manager.qq.sendGroupMessage(self,group,"哈哈我算完啦！让我看看...我最终一共中奖" +String(GetPrize)+ "次,未中奖" +String(UngetPrize)+ "次，中奖频率差不多有" +String(((GetPrize/(GetPrize+UngetPrize))*100))+ "%");
        }
};
ReplyMessageTool["#签到"] = function(fromqq,self,group,message){
        SignIn_Data = JSON.parse(manager.readFile(manager.getFile('SBot','BotSignIn.json')));
        if (SignIn_Data['HadSignedIn'][fromqq] == undefined){
            BasicTools.addBotLocalMoney(fromqq,400,self,group);
            manager.qq.sendGroupMessage(self,group,'[@' +fromqq+ "]你来啦你来啦！我都想你好久了呢\\u0E05( \\u0333\\u2022 \\u25E1 \\u2022 \\u0333)\\u0E05，这400枚金币就给你啦！");
            SignIn_Data['HadSignedIn'][fromqq] = 'HadSignedIn';
            manager.writeFile(manager.getFile('SBot','BotSignIn.json'),JSON.stringify(SignIn_Data,null,"\t"));
        }
        else if (SignIn_Data['HadSignedIn'][fromqq] != undefined){
            var SignInStatus = BasicTools.BotSignIn();
            if (SignInStatus == false || SignInStatus == 'false'){
                manager.qq.sendGroupMessage(self,group,'[@' +fromqq+ "]我好像刚刚才见过你呢，不如...明天咱们再见面？");
            }
            else if(SignInStatus == true || SignInStatus == 'true'){
                BasicTools.addBotLocalMoney(fromqq,400,self,group);
                manager.qq.sendGroupMessage(self,group,'[@' +fromqq+ "]你来啦你来啦！我都想你好久了呢\\u0E05( \\u0333\\u2022 \\u25E1 \\u2022 \\u0333)\\u0E05，这400枚金币就给你啦！");
                NewSignIn_Data = JSON.parse(manager.readFile(manager.getFile('SBot','BotSignIn.json')));
                NewSignIn_Data['HadSignedIn'][fromqq] = 'HadSignedIn';
                manager.writeFile(manager.getFile('SBot','BotSignIn.json'),JSON.stringify(NewSignIn_Data,null,"\t"));
            }
            else{
                manager.qq.sendGroupMessage(self,group,fromqq+ "签到过程发生了错误，请联系作者Disy，错误码SignFunctiongetElseCondition");
            }
        }
        else{
            manager.qq.sendGroupMessage(self,group,fromqq+ "签到过程发生了错误，请联系作者Disy，错误码SignDatagetElseCondition");
        }
};
ReplyMessageTool["#查询我的余额"] = function(fromqq,self,group,message){
    ReturnMoney = BasicTools.getBotLocalMoney(fromqq,self,group);
     manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "] 哈哈又担心自己钱不够啦？您钱包中还有" +String(ReturnMoney)+ "元哦!(\\u25E6˙▽˙\\u25E6)Σ");
};

ReplyMessageTool["#添加金币"] = function(fromqq,self,group,message){
      if (fromqq == adminqq){
          addmoneyf = message.replace('#添加金币','');
          addmoney = Number(Number(addmoneyf.substr(0,addmoneyf.indexOf('给'))).toFixed(2));
          toMan = addmoneyf.replace(addmoney + '给','').replace("[@","").replace("]","").replace(" ","");
          MData = BasicTools.addBotLocalMoney(toMan,addmoney,self,group);
          manager.qq.sendGroupMessage(self,group,"好啦主人！现在[@" +toMan+ "]的余额变成:" +String(BasicTools.getBotLocalMoney(toMan,self,group))+ "了哦");
      }
      else{
          manager.qq.sendGroupMessage(self,group,"哼！你不是我的主人！我才不会听你的！");
      }
}

ReplyMessageTool["#去打工"] = function(fromqq,self,group,message){
    if (message.indexOf("小时") != -1){
        needTime = Number(message.replace('#去打工','').replace('小时',''));
        stored_worktime = JSON.parse(manager.readFile(manager.getFile('SBot','BotWorkTime.json')));
        if (stored_worktime[fromqq] == undefined){
            stored_worktime[fromqq] = {};
            stored_worktime[fromqq].workstatus = 0;
        }
        if (isNaN(needTime) || needTime < 0.001 || needTime == null){
            manager.qq.sendGroupMessage(self,group,"嘛~您输入的这个时间我完全不懂呐( \\u2022\\u0301 . \\u2022\\u0300 )\\uD83D\\uDCA6");
        }
        else if (needTime > 12){
            manager.qq.sendGroupMessage(self,group,"哇，一下子干那么长时间，身体会受不了吧，不如给自己定个小于12小时的目标吧！");
        }
        else if (stored_worktime[fromqq].workstatus != 1){
            WorkTimeNow = BasicTools.getUnixTime();
            stored_worktime[fromqq].startTime = WorkTimeNow;
            stored_worktime[fromqq].whenFinished = WorkTimeNow + Math.round(needTime*3600);
            stored_worktime[fromqq].getMoney = needTime*150;
            stored_worktime[fromqq].workstatus = 1;
            stored_worktime[fromqq].group = group;
            manager.writeFile(manager.getFile('SBot','BotWorkTime.json'),JSON.stringify(stored_worktime,null,"\t"));
            manager.qq.sendGroupMessage(self,group,fromqq + "您已开始打工，预计在结束后获得" +String(stored_worktime[fromqq].getMoney)+ "枚金币！");
        }
        else if (stored_worktime[fromqq].workstatus == 1){
            manager.qq.sendGroupMessage(self,group,"您还未结算上次打工，请输入“#查询我的打工信息”结算或查询上一次打工");
        }
    }
    else{
        manager.qq.sendGroupMessage(self,group,"嘛~您输入的这个格式我完全不懂呐( \\u2022\\u0301 . \\u2022\\u0300 )\\uD83D\\uDCA6，按照“#去打工N小时”（N为阿拉伯数字）这个格式输入吧！");
    }
};

ReplyMessageTool["#查询我的打工信息"] = function(fromqq,self,group,message){
    stored_outworktime = JSON.parse(manager.readFile(manager.getFile('SBot','BotWorkTime.json')));
    UTimeNow = BasicTools.getUnixTime();
    if (UTimeNow < stored_outworktime[fromqq].whenFinished && stored_outworktime[fromqq].workstatus == 1){
        remainHours = parseInt((stored_outworktime[fromqq].whenFinished - UTimeNow)/3600);
        remainMinutes = parseInt(((stored_outworktime[fromqq].whenFinished - UTimeNow)- remainHours*3600)/60);
        remainSeconds = (stored_outworktime[fromqq].whenFinished - UTimeNow) - remainHours*3600 - remainMinutes*60;
        manager.qq.sendGroupMessage(self,group,"[监工系统][@" +fromqq+ "]您的工作还没有完成哒，不过别急啦，手头的工作预计在" +String(remainHours)+ '小时' +String(remainMinutes)+ '分' +String(remainSeconds)+ '秒后就能完成啦！');
    }
    else if (UTimeNow >= stored_outworktime[fromqq].whenFinished && stored_outworktime[fromqq].workstatus == 1){
        stored_worktime = JSON.parse(manager.readFile(manager.getFile('SBot','BotWorkTime.json')));
        stored_worktime[fromqq].workstatus = 0;
        BasicTools.addBotLocalMoney(fromqq,stored_worktime[fromqq].getMoney,self,group);
        manager.qq.sendGroupMessage(self,group,"[监工系统][@" +fromqq+ "]欢迎你打工回来，干了半天累了吧，工资" +String(stored_worktime[fromqq].getMoney)+ "元我已经帮您领到了呢，快去休息休息吧！");
        stored_worktime[fromqq].getMoney = 0;
        manager.writeFile(manager.getFile('SBot','BotWorkTime.json'),JSON.stringify(stored_worktime,null,"\t"));
    }
    else{
        manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]emm...似乎您正在休息诶，不如试试用“#去打工”指令来一场说干就干的打工吧！");
    }
};

ReplyMessageTool["#强制停止自己打工"] = function(fromqq,self,group,message){
    if (message == "#强制停止自己打工"){
        stored_worktime = JSON.parse(manager.readFile(manager.getFile('SBot','BotWorkTime.json')));
        SUTimeNow = BasicTools.getUnixTime();
        if (stored_worktime[fromqq] == undefined){
            manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]似乎您从未参加过打工诶，这让我怎么帮你强制停止嘛！");
        }
        else if (stored_worktime[fromqq].workstatus != 1){
            manager.qq.sendGroupMessage(self,group,"[@" +fromqq+ "]emm...似乎您正在休息诶，这让我怎么帮你强制停止嘛！");
        }
        else if (stored_worktime[fromqq].workstatus == 1 && SUTimeNow < stored_worktime[fromqq].whenFinished){
            canGetMoney = (SUTimeNow - stored_worktime[fromqq].startTime)/3600*150*0.3;
            canGetMoney = Number(canGetMoney.toFixed(2));
            stored_worktime[fromqq].workstatus = 0;
            manager.writeFile(manager.getFile('SBot','BotWorkTime.json'),JSON.stringify(stored_worktime,null,"\t"));
            BasicTools.addBotLocalMoney(fromqq,canGetMoney,self,group);
            manager.qq.sendGroupMessage(self,group,"[监工系统][@" +fromqq+ "]可惜了，您一定要强制离开了岗位，作为惩罚，公司交付的工资仅有原来的30%：" +String(canGetMoney)+ "元了...");
        }
        else if (stored_worktime[fromqq].workstatus == 1 && SUTimeNow >= stored_worktime[fromqq].whenFinished){
            manager.qq.sendGroupMessage(self,group,"[监工系统][@" +fromqq+ "]您已经完成上次打工啦，无需强制停止，或许你可以试试输入“#查询我的打工信息”结算上一次打工");
        }
        else{
            manager.qq.sendGroupMessage(self,group,fromqq+ "强制结束打工过程发生了错误，请联系作者Disy，错误码WorkgetElseCondition");
        }
    }
};

ReplyMessageTool["#人工智障"] = function(fromqq,self,group,message){
    if (message.indexOf('#人工智障：') != -1 || message.indexOf('#人工智障:') != -1){
        manager.writeFile(manager.getFile('SBot','test.txt'),message);
        outchat = message.replace('#人工智障','').replace(':','',1).replace('：','',1).replace('你','我').replace('吗','').replace('吧','').replace('嘛','').replace('?','!').replace('？','！');
        if (outchat != null && outchat != ''){
            manager.qq.sendGroupMessage(self,group,'(这是[@' +fromqq+ ']让我说的！) ' + outchat);
        }
        else{
            manager.qq.sendGroupMessage(self,group,"你也不说话，让我怎么回答你嘛！");
        }
    }
};

ReplyMessageTool["#人工智能"] = function(fromqq,self,group,message){
    if (message.indexOf('#人工智能：') != -1 || message.indexOf('#人工智能:') != -1){
        inputMessage = message.replace('#人工智能','').replace(':','',1).replace('：','',1);
        inputMessage = encodeURI(inputMessage);
        outMessage = manager.httpRequest('GET','http://api.qingyunke.com/api.php','key=free&appid=0&msg=' +inputMessage);
        JoutMessage = JSON.parse(outMessage);
        outAIChat = manager.callFunction('PyUtf8ToGbk',JoutMessage.content);
        for (var c = 0;c < 200;c++){
            outAIChat = outAIChat.replace('{face:' +c+ '}','[bq' +c+ ']');
        };
        outAIChat = outAIChat.split("{br}").join("\n")
        manager.qq.sendGroupMessage(self,group,outAIChat);
    }
};

ReplyMessageTool["#绑定游戏"] = function(fromqq,self,group,message){
    if (message.indexOf('#绑定游戏ID') != -1 || message.indexOf('#绑定游戏id') != -1){
        PlayerIDList = JSON.parse(manager.readFile(manager.getFile('SBot','BotPlayersID.json')));
        PlayerID = message.replace('#绑定游戏id','').replace('#绑定游戏ID','').replace(':','').replace('：','');
        var hadRegistered = 0;
        if (PlayerID != null){
            for (var i= 0;i < PlayerIDList['QQID'];i++){
                i = String(i);
                if (PlayerIDList[i].PlayerID == PlayerID){
                    hadRegistered = 1;
                    RegisteredQQ = PlayerIDList[i].QQNumber;
                    break
                }
                else if (PlayerIDList[i].QQNumber == fromqq){
                    hadRegistered = 2;
                    RegisteredPlayer = PlayerIDList[i].PlayerID;
                    break
                }
            }
            if (hadRegistered == 0){
                PlayerIDList[PlayerIDList['QQID']] = {};
                PlayerIDList[PlayerIDList['QQID']].QQNumber = fromqq;
                PlayerIDList[PlayerIDList['QQID']].PlayerID = PlayerID;
                PlayerIDList['QQID'] = PlayerIDList['QQID'] + 1;
                manager.qq.sendGroupMessage(self,group,"[SL管理系统]" +fromqq+ "您已成功绑定游戏ID:" +PlayerID+ "!");
                manager.writeFile(manager.getFile('SBot','BotPlayersID.json'),JSON.stringify(PlayerIDList,null,"\t"));
            }
            else if(hadRegistered == 1){
                manager.qq.sendGroupMessage(self,group,"[SL管理系统]很抱歉，该ID已被QQ号为" +RegisteredQQ+ "的用户绑定！");
            }
            else if(hadRegistered == 2){
                manager.qq.sendGroupMessage(self,group,"[SL管理系统]很抱歉，您的QQ号已绑定ID:" +RegisteredPlayer);
            }
            else{
                manager.qq.sendGroupMessage(self,group,fromqq+ "绑定游戏ID的过程发生了错误，请联系作者Disy，错误码PlayersIDgetElseCondition");
            }
        }
        else{
            manager.qq.sendGroupMessage(self,group,fromqq+ "请输入合法的游戏ID");
        }
    }
};

ReplyMessageTool["#赌博"] = function(fromqq,self,group,message){
    TagMoney = Number(message.substr(message.indexOf('#赌博')+3,message.indexOf('元')-message.indexOf('#赌博')-3).replace(' ',''));
    if(isNaN(TagMoney)||TagMoney<=0||TagMoney>BasicTools.getBotLocalMoney(fromqq)){
        manager.qq.sendGroupMessage(self,group,'[@'+fromqq+']格式错误或您没那么多钱！\n正确的格式是：#赌博XXX元');
        return;
    }
    if(Math.random()*100<60){
        manager.qq.sendGroupMessage(self,group,'[@'+fromqq+']您赢了！给您'+String(TagMoney)+'元！');
        BasicTools.addBotLocalMoney(fromqq,TagMoney,self,group);
    }
    else{
        manager.qq.sendGroupMessage(self,group,'[@'+fromqq+']很遗憾，虽然有50%几率，您还是输了！');
        BasicTools.addBotLocalMoney(fromqq,0 - TagMoney,self,group);
    }
}

ReplyMessageTool["#反馈BUG"] = function(fromqq,self,group,message){
    if(manager.readFile(manager.getFile('SBot','BUGs')).indexOf('\n'+fromqq+' : ')==-1)
        manager.writeFile(manager.getFile('SBot','BUGs'),manager.readFile(manager.getFile('SBot','BUGs'))+'\n'+fromqq+' : '+message.substr(6));
    else{
    manager.qq.sendGroupMessage(self,group,'[@'+fromqq+']你反馈过了，等管理员处理吧');
    }
    manager.qq.sendGroupMessage(self,group,'[@'+fromqq+']您的问题我已经记下来了呢');
}

ReplyMessageTool["#查询BUG"] = function(fromqq,self,group,message){
    if(message=='#查询BUGclear'&&(fromqq==adminqq||fromqq=='965556187')){
        manager.writeFile(manager.getFile('SBot','BUGs'),'');
    }
    if(fromqq==adminqq||fromqq=='965556187'){
        manager.qq.sendGroupMessage(self,group, manager.readFile(manager.getFile('SBot','BUGs')));
    }
    else{
        manager.qq.sendGroupMessage(self,group,'[@'+fromqq+']您还没有权限哦~有BUG就快#反馈BUG吧~~~');
    }
}

ReplyMessageTool["#SL"] = function(fromqq,self,group,message){
    manager.qq.sendGroupPicMessage(self,group,manager.getFile("SL.png"),"StarLight图标：%picture0%");
}

ReplyMessageTool["[bq178]"] = function(fromqq,self,group,message){
    if (message == "[bq178]"){
        sendChoose = BasicTools.randomNum(1, 3)
        if (sendChoose >=2){
            manager.qq.sendGroupMessage(self,group,"[bq178][bq178][bq178]一起滑稽咯！");
        }
        else {
            manager.qq.sendGroupMessage(self,group,"对着我这么可爱的一个女孩子，天天发滑稽是不是不太好...");
        }
    }
};
    
//储存收到的消息库
var ReceivedMessage = ["#赌博","#反馈BUG","#查询BUG","#SL","#抽奖","#修改中奖率#","#财富榜","#转账","#服务器信息","#查询我的云黑状态","#help","#打劫","#招募小弟","#验证中奖率","#签到","#查询我的余额","#添加金币","#去打工","#查询我的打工信息","#强制停止自己打工","#人工智障","#人工智能","#绑定游戏","[bq178]"];

//调用BlocklyNukkit事件以进行一些互动
function QQGroupMessageEvent(event){   //设置监听器监听群聊内容
    let self = event.getSelfQQ();      //获取机器人自身QQ
    Botself = self;                    //储存该变量，以备他用
    let group = event.getFromGroup();  //获取收到消息的群号
    let fromqq = event.getFromQQ();    //获取发送消息的QQ号
    let message = event.getMessage();  //获取发送的消息内容
/*以上皆是对机器人相关的API的调用*/

//在库中寻找相符的消息并按照相关方法进行回复
    for (var n = 0;n < ReceivedMessage.length - 1;n++){
		if (message == '[bq178]'){
			logger.info('[' +fromqq+ ']尝试发送表情：滑稽');
			ReplyMessageTool['[bq178]'](fromqq,self,group,message);
			break;
		}
        else if (message.indexOf(ReceivedMessage[n]) != -1 && message.indexOf('[bq178]') == -1){
            ReplyMessageTool[ReceivedMessage[n]](fromqq,self,group,message);
            logger.info('[' +fromqq+ ']尝试执行命令：' +message);
            break;
        }
    }
    if (message == '#帮助' || message == '#菜单' || message == '菜单'){
        ReplyMessageTool["#help"](fromqq,self,group,message);
    };
};

function QQFriendMessageEvent(event){  //设置监听器监听私聊内容
    let self = event.getSelfQQ();      //获取机器人自身QQ
    let fromqq = event.getFromQQ();    //获取发送消息的QQ号
    let message = event.getMessage();  //获取发送的消息内容
    
    //该部分代码用于删除数组中指定元素
    //获取元素在数组的下标
    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val)	{ 
                return i;
            };
        }
        return -1; 
    };

    //根据数组的下标，删除该下标的元素
    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
        this.splice(index, 1);
        }
    };
	if(message.substr(0,1)=='y'){
		StoredEmployeesData = JSON.parse(manager.readFile(manager.getFile('SBot','PlayerEmployees.json')));
		TargetHirer=message.substr(1);
		for(var i in StoredEmployeesData['Hirer']['WillHire']){
			if(i.QQ==fromqq){
				
			}
		}
	}
/*	
    switch (message){
        case 'y':
            for (let keys in StoredEmployeesData["PlayersData"]){
                if (StoredEmployeesData["Hirer"][keys]["WillHire"] != undefined){
                    if (StoredEmployeesData["PlayersData"][keys]["WillHire"].indexOf(fromqq) != -1){
                        StoredEmployeesData['PlayersData'][keys]["HadHired"].push(fromqq);
                        StoredEmployeesData["PlayersData"][keys]["WillHire"].remove(fromqq);
                        NewHiredTime = StoredEmployeesData['PlayersData'][keys][fromqq]['WillHireTime'][0];
                        StoredEmployeesData['PlayersData'][keys][fromqq]['WillHireTime'] = [];
                        StoredEmployeesData['PlayersData'][keys][fromqq]['HadHireTime'][0] = BasicTools.getUnixTime() + NewHiredTime*24*60*60;
                        BasicTools.addBotLocalMoney(fromqq,StoredEmployeesData["Employees"].NeedMoney,self,null);
                        BasicTools.addBotLocalMoney(keys,StoredEmployeesData["Employees"].NeedMoney*(-1),self,null);
                        manager.writeFile(manager.getFile('SBot','PlayerEmployees.json'),JSON.stringify(StoredEmployeesData,null,"\t"));
                        manager.qq.sendFriendMessage(self,fromqq,"您已成功接受" +keys+ "的招募请求，获得对方交付的工资" +String(StoredEmployeesData["Employees"].NeedMoney)+ "元");
                        manager.qq.sendFriendMessage(self,keys,fromqq + "已经接受您的招募请求，正式成为你的小弟啦！");
                        break
                    }
                }
            }
            break
        case 'n':
            manager.qq.sendFriendMessage(self,fromqq,"您已成功拒绝" +keys+ "的招募请求");
            StoredEmployeesData["PlayersData"][keys]["WillHire"].remove(fromqq);
            manager.writeFile(manager.getFile('SBot','PlayerEmployees.json'),JSON.stringify(StoredEmployeesData,null,"\t"));
            break
    }
	*/
}