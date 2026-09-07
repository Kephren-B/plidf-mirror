var CommentManager = CommentManager || new (function(){
  this.call = 'CommentManager';
  this.ajaxUrl = '/ajax.php';
  const max_level_answer = 5;
  window.cm = this;
  var parent = this;
  
  this.displayCommentBlock = function(block,cont){    
    if(!cont){ cont = document.createElement('div');
      document.getElementById('comments-blocks-div').appendChild(cont);
      cont.dataset.block_id = block.block_id;
      cont.dataset.topic_uid = block.topic_uid;
      cont.id = 'comments-block-'+block.block_id;
    }
    this.displayComment(cont,block.root);
  }
  
  this.displayComment = function(cont,comment){
    cont.innerHTML = '';
    console.log('display comment '+comment.comment_id);
    var div = document.createElement('div');
    cont.appendChild(div);
    div.classList.add('comment-div');
    div.dataset.comment_id = comment.comment_id;
    div.dataset.block_id = comment.block_id;
    div.dataset.topic_uid = comment.topic_uid;
    var e = document.createElement('div');
    div.appendChild(e);
	e.classList.add('comment-title-div');
    var h3 = '<small>'+ comment.user_name + '</small>';
	if(comment.title && (comment.title != ''))
      h3 = comment.title + '<small>'+ ' par '+comment.user_name + '</small>';
    var h = document.createElement('h5');
    var ci = document.createElement('div');
	ci.classList.add('comment-id-div');
	ci.innerHTML = comment.comment_id;
	h.appendChild(ci);
    h.innerHTML += h3;
	h.title = 'Published on '+comment.ts;
    e.appendChild(h);
	e.id = 'comment-'+comment.comment_id;
	
	
    e = document.createElement('div');
    div.appendChild(e);
	e.classList.add('comment-content-div');
	e.innerHTML = comment.content;
    if(comment.level < max_level_answer){
      e = document.createElement('div');
      div.appendChild(e);
      this.makeCommentAnswer(e,comment);
    }
    
    var ul = document.createElement('ul');
    div.appendChild(ul);
    ul.classList.add('comment-answers-ul');
    
    if(comment.children)
      for(var i=0;i<comment.children.length;i++){
	var li = document.createElement('li'); 
	ul.appendChild(li);
	this.displayComment(li,comment.children[i]);
      }
  }
  
  this.makeCommentAnswer = function(cont,comment){
    cont .innerHTML = '';
    cont.classList.add('comment-answer-div');
    var div = document.createElement('div');
    cont.appendChild(div);
    div.className = 'answer-comment-button-div';
    var button  =document.createElement('button');
    div.appendChild(button);
    button.innerHTML = 'repondre';
    button.className  ='answer-comment-button';
    button.setAttribute('onclick',this.call+".displayAnswerCommentForm(this,'"+comment.topic_uid
    +"',"+comment.block_id+","+comment.comment_id+")");
    var div = document.createElement('div');
    cont.appendChild(div);
    div.className = 'answer-comment-form-div';
  }
  
  this.displayAnswerCommentForm = function(button,topic_uid,block_id,parent_id){
    button.style.display = 'none';
    cont = button.parentNode.nextElementSibling;
    cont.innerHTML = '';
    this.displayCommentForm(cont,topic_uid,block_id,parent_id);
  }
  
  this.displayCommentForm = function(cont,topic_uid,block_id,parent_id,message,message_class){
	if(cont)
	  return;
    cont.innerHTML = '';
    if(block_id >0){
      var h6 = document.createElement('h6');
	  h6 .innerHTML = 'Votre reponse';
      cont.appendChild(h6);
    }
    if(!block_id){
      block_id = 0;
    }
    if(!parent_id){
      parent_id = 0;
    }
    var fform = document.createElement('form');
    cont.appendChild(fform);
    fform.method = 'POST';
    fform.onsubmit = function(ev){
      if(!this.checkValidity())
	return false;
      var data = {};
      for(var i=0;i<this.elements.length;i++){
	var input = this.elements[i];
	data[input.name] = input.value;
      }
      parent.postComment(this,data);
      return false;
    }
    
    var p = document.createElement('p');
    fform.appendChild(p);
    p.classList.add('form-message-p');
    if(message){
      p.innerHTML = message;
      if(message_class){
	p.classList.add('form-message-'+message_class);
      }
    }
    
    var input = document.createElement('input');
    fform.appendChild(input);
    input.type = 'hidden';
    input.name = 'topic_uid';
    input.value = topic_uid;
    
    var input = document.createElement('input');
    fform.appendChild(input);
    input.type = 'hidden';
    input.name = 'block_id';
    input.value = block_id;
    
    var input = document.createElement('input');
    fform.appendChild(input);
    input.type = 'hidden';
    input.name = 'parent_id';
    input.value = parent_id;
    
    
    var table = document.createElement('table');
    fform.appendChild(table);
    table .classList.add('post-comment-table');
    
    var tbody = document.createElement('tbody');
    table.appendChild(tbody);
    
    var inputs = {
      'pseudo':{
	type:'input',
	subtype:'text',
	size:40,
	legend:'Pseudonyme',
	required:true
      },
      'email':{
	type:'input',
	subtype:'email',
	size:40,
	legend:'Email',
	required:true
      },
      'site':{
	type:'input',
	subtype:'text',
	size:40,
	legend:'Votre site',
	required:false
      },
      'title':{
	type:'input',
	subtype:'text',
	size:40,
	legend:'Titre',
	required:false
      },
      'content':{
	type:'textarea',
	rows:7,
	cols:46,
	legend:'Commentaire',
	required:true
      },
    };
    for(var key in inputs){
      var infos = inputs[key];
      var tr = document.createElement('tr');
      tbody.appendChild(tr);
      var td = document.createElement('td');
      tr.appendChild(td);
      var label =document.createElement('label');
      td.appendChild(label);
      label.innerHTML = infos.legend;
      label.for = key;
      var td = document.createElement('td');
      tr.appendChild(td);
      switch(infos.type){
	case 'textarea':
	  var ta = document.createElement('textarea');
	  td.appendChild(ta);
	  ta.name = key;
	  ta.cols = infos.cols;
	  ta.rows = infos.rows;
	  if(infos.required)
	    ta.setAttribute('required',true);
	  break;
	case 'input':
	  var input = document.createElement('input');
	  td.appendChild(input);
	  input.name = key;
	  input.type = infos.subtype;
	  input.size = infos.size;
	  if(infos.required)
	    input.setAttribute('required',true);
      }
    }
    
    var tfoot = document.createElement('tfoot');
    table.appendChild(tfoot);
    var tr = document.createElement('tr');
    tfoot.appendChild(tr);
    var td = document.createElement('td');
    tr.appendChild(td);
    td.style.textAlign = 'right';
    td.colSpan = 2;
    var send = document.createElement('input');
    td.appendChild(send);
    send.type='submit';
    //send.value='Previsualiser';
    send.name= 'preview';
    if(block_id>0){
      var cancel = document.createElement('input');
      td.appendChild(cancel);
      cancel.type='reset';
      cancel.value='Annuler';
      cancel.name= 'annuler';
      cancel.onclick = function(){
        parent.cancelComment(fform);
      }
    }
  }

  this.displayCommentsSection = function(uid,start,limit,sort){
    this.thread_uid = uid;
    if(!start){
      start = 0;
    }
    if(!limit){
      limit = 20;
    }
    if(!sort){
      sort = 'oldest';
    }
    var cont = document.getElementById('comments-div');
    cont.innerHTML = '';
    
    var div = document.createElement('div');
    cont.appendChild(div);
    div.id = 'start-comment-block-div';
    this.displayCommentForm(div,uid);
    
    var div = document.createElement('div');
    cont.appendChild(div);
    div.id = 'top-comment-pagination-div';
    
    var div = document.createElement('div');
    cont.appendChild(div);
    div.id = 'comments-blocks-div';
    
    var div = document.createElement('div');
    cont.appendChild(div);
    div.id = 'bottom-comment-pagination-div';
    
	var prop = 'lo'+'ca+'+'tion';
    var xhr = new XMLHttpRequest();
    xhr.open('POST',this.ajaxUrl+'?ac=comments&a=loadBlocksAndPagination&uid='+uid+'&start='+start+'&limit='+limit+'&sort='+sort);
    xhr.onload = function(ev){
      var log = false;
      try{
		var ans = JSON.parse(this.responseText);
		if(ans.blocks){
		  for(var i = 0;i<ans.blocks.length;i++){
			var block = ans.blocks[i];
			parent.displayCommentBlock(block);
		  }
		}
      } catch(e){
      }
	}
	var fd = new FormData();
	var token = '';
	token += (window[prop]+'').replace('pli','ilpilp').replace('/','_');
	var d = new Date();
    token += '_'+d.getTime();
	token = btoa(token);
	fd.append('tk',token)
    xhr.send(fd);
  }
  
  this.cancelComment = function(fform){
      var button = fform.parentNode.parentNode.querySelector('button').style.display = 'inline';
      fform.remove();
  }
  
  this.postComment = function(form,data){
    var fd = new FormData();
    for(var key in data){
      fd.append(key,data[key]);
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST',this.ajaxUrl+'?ac=comments&a=postComment');
    xhr.onload = function(){
      var log = false;
      try{
	var ans = JSON.parse(this.responseText);
	if(ans.log){
	  var pre = document.createElement('pre');
	  pre.innerHTML  = ans.log;
	  log = pre.textContent;
	}
	if(ans.success){
	  parent.processSendMessage(form,data,ans.message);
	}
      } catch(e){
	var pre = document.createElement('pre');
	pre.innerHTML = this.responseText;
	
	  log = pre.textContent;
	console.log(e)
      }
      if(log)
	console.log(log);
    }
    xhr.send(fd);
  }
  
  this.processSendMessage = function(fform,data,message){
    var div = document.createElement('div');
    div.classList.add('comment-form-message');
    fform.parentNode.insertBefore(div,fform);
    if(message.classes){
      div.classList.add(message.classes);
    }
    div.innerHTML = message.text;
    var to = window.setTimeout(function(){
      
      div.remove();
    },20000);
    
    fform.reset();
    if(data.block_id > 0){
      var button = fform.parentNode.parentNode.querySelector('button').style.display = 'inline';
      fform.remove();
    }
  }
  
  this.reportShared = function(mode,uid){
    var xhr = new XMLHttpRequest();
    xhr.open('POST',this.ajaxUrl+'?ac=comment');
    xhr.onload = function(){
    }
    var fd = new FormData();
    fd.append('action','shared');
    fd.append('mode',mode);
    fd.append('uid',uid);
    xhr.send(fd);
  }  
  
  this.reportMap = function(map,uid){
	var xhr = new XMLHttpRequest();
	xhr.open('POST',this.ajaxUrl+'?ac=comment');
    xhr.onload = function(){
    }
    var fd = new FormData();
    fd.append('action','mapAction');
    fd.append('type','showMap');
    fd.append('map',map);
    fd.append('uid',uid);
    xhr.send(fd);
  }
  
  this.showStationMap = function(uid){
	var xhr = new XMLHttpRequest();
	xhr.open('POST',this.ajaxUrl+'?ac=comment');
    xhr.onload = function(){
    }
    var fd = new FormData();
    fd.append('action','mapAction');
    fd.append('type','showStationMap');
    fd.append('uid',uid);
    xhr.send(fd);
  } 
  
  this.seeOnOSM = function(uid){
	 var xhr = new XMLHttpRequest();
	xhr.open('POST',this.ajaxUrl+'?ac=comment');
    xhr.onload = function(){
    }
    var fd = new FormData();
     fd.append('action','mapAction');
    fd.append('type','seeOnOSM');
    fd.append('uid',uid);
    xhr.send(fd);
  }
  
  this.showGeo = function(map){
	var xhr = new XMLHttpRequest();
	xhr.open('POST',this.ajaxUrl+'?ac=comment');
    xhr.onload = function(){
    }
    var fd = new FormData();
    fd.append('action','mapAction');
    fd.append('type','showGeo');
    fd.append('uid','');
    fd.append('map',map);
    xhr.send(fd);
  } 
});

window.onload = function(){
    if(!document.cookie || !document.cookie.includes('rgpd=ok')){
var rgpd = document.createElement('div');
rgpd.style = "background-color:#1D4743;position:fixed;opacity:1;text-align:center;bottom:5px;color:white;z-index:1;padding:5px;width:98%;margin:0 1% 0 1%;";
document.body.appendChild(rgpd);
rgpd.innerHTML = '<small style="margin-right:50px;">Ce site internet utilise des cookies anonymes pour des mesures d\'audience. En poursuivant votre navigation sur notre site, vous acceptez leur utilisation.</small><span style="float:right;border:solid 1px white;cursor:pointer;padding:2px;margin-right:5px;" onclick="this.parentNode.remove();document.cookie = \'rgpd=ok; expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/;\'" title="Fermer ce bandeau">X</span>';
    }
}
