
function BufferedSink(opts){
    this.maxSize = opts.maxSize || 10;
    this.writeItems = opts.writeItems;
    this.cache = [];
}

BufferedSink.prototype.flush = function(cb){
    var self = this;
    this.writeItems(this.cache, function(err){
        if(err){ return cb(err); }
        self.cache = [];
        return cb.apply(null, [].slice.call( arguments ) );
    });
};

BufferedSink.prototype.write = function(item, cb) {
    this.cache.push( item );
    if ( this.cache.length < this.maxSize ){
        return cb( null );
    }
    this.flush( function(err){
        if(err) { return cb(err); }
        return cb( null );
    });
};

module.exports = BufferedSink;
