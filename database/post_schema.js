/**
 * 게시판을 위한 데이터베이스 스키마를 정의하는 모듈
 *
 * @date 2016-11-10
 * @author Mike
 * @modified by hou27
 */

var utils = require('../utils/utils');

var SchemaObj = {};

SchemaObj.createSchema = (mongoose) => {
	
	// 글 스키마 정의
	var PostSchema = mongoose.Schema({
	    title: {type: String, trim: true, 'default':''},		// 글 제목
	    contents: {type: String, trim: true, 'default':''},						// 글 내용
	    writer: {type: mongoose.Schema.ObjectId, ref: 'users1'},							// 글쓴 사람
	    comments: [{		// 댓글
	    	contents: {type: String, trim:true, 'default': ''},					// 댓글 내용
	    	writer: {type: String, trim:true, 'default': ''},
	    	created_at: {type: Date, 'default': Date.now}
	    }],
		imageUrl: {type: String, 'default':''},					//local의 image주소
	    tags: {type: [], 'default': ''},
        hits: {type: Number, 'default': 0},   // 조회수
	    created_at: {type: Date, index: {unique: false}, 'default': Date.now},
	    updated_at: {type: Date, index: {unique: false}, 'default': Date.now}
	});
	
	// 필수 속성에 대한 'required' validation
	PostSchema.path('title').required(true, '글 제목을 입력하셔야 합니다.');
	PostSchema.path('contents').required(true, '글 내용을 입력하셔야 합니다.');
	
	// 스키마에 인스턴스 메소드 추가
	PostSchema.methods = {
		savePost: function(callback) {		// 글 저장
			var self = this;
			
			this.validate(function(err) {
				if (err) return callback(err);
				
				self.save(callback);
			});
		},
		addComment: function(user, comment, callback) {		// 댓글 추가
			this.comment.push({
				contents: comment.contents,
				writer: user._id
			});
			
			this.save(callback);
		},
		removeComment: function(id, callback) {		// 댓글 삭제
			var index = utils.indexOf(this.comments, {id: id});
			if (~index) {
				this.comments.splice(index, 1);
			} else {
				return callback('ID [' + id + '] 를 가진 댓글 객체를 찾을 수 없습니다.');
			}
			
			this.save(callback);
		}
	}
	
	PostSchema.statics = {
		// ID로 글 찾기
		load: function(id, callback) {
			this.findOne({_id: id})
				//ObjectId를 실제 객체로 치환 -- writer에 매칭된 객체를 name, provider, email로 치환
				.populate('writer', 'name provider email')
				.exec(callback);
		},
		list: function(options, callback) {
			var criteria = options.criteria || {};
			
			this.find(criteria)
				.populate('writer', 'name provider email')
				.sort({'created_at': -1})
				.limit(Number(options.perPage))
				.skip(options.perPage * options.page)
				.exec(callback);
		},
        incrHits: function(id, callback) {
            var query = {_id: id};
            var update = {$inc: {hits:1}};
            var options = {upsert: true, 'new': true, setDefaultsOnInsert: true};
            
            this.findOneAndUpdate(query, update, options, callback);            
        }
	}
	
	console.log('PostSchema 정의함.');

	return PostSchema;
};

// module.exports에 PostSchema 객체 직접 할당
module.exports = SchemaObj;