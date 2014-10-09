
function BufferedSink(opts){
    this.maxSize = opts.maxSize || 10;
    this.writeItems = opts.writeItems;
    this.cache = [];
    this.tempCache = [];
    this.isWriting = false;
}

BufferedSink.prototype.flush = function(cb){
    var self = this;
    this.isWriting = true;
    this.writeItems(this.cache, function(err){
        self.cache = self.tempCache;
        self.tempCache = [];
        self.isWriting = false;
        if(err){ return cb(err); }
        return cb.apply(null, [].slice.call( arguments ) );
    });
};

BufferedSink.prototype.write = function(item, cb) {
    if ( this.isWriting ){
        this.tempCache.push( item );
        cb( null );
    } else {
        this.cache.push( item );
        if ( this.cache.length < this.maxSize ){
            return cb( null );
        }
        this.flush( function(err){
            if(err) { return cb(err); }
            return cb( null );
        });
    }
};

module.exports = BufferedSink;
