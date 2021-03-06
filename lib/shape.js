// Rotate shape around the z-axis
rotateZ3D = function(theta, nodes) {
    var sin_t = Math.sin(theta);
    var cos_t = Math.cos(theta);
    
    for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var y = node[1];
        node[0] = x * cos_t - y * sin_t;
        node[1] = y * cos_t + x * sin_t;
    }
};

var rotateY3D = function(theta, nodes) {
    var sin_t = Math.sin(theta);
    var cos_t = Math.cos(theta);
    
    for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var x = node[0];
        var z = node[2];
        node[0] = x * cos_t - z * sin_t;
        node[2] = z * cos_t + x * sin_t;
    }
};

var rotateX3D = function(theta, nodes) {
    var sin_t = Math.sin(theta);
    var cos_t = Math.cos(theta);
    
    for (var n = 0; n < nodes.length; n++) {
        var node = nodes[n];
        var y = node[1];
        var z = node[2];
        node[1] = y * cos_t - z * sin_t;
        node[2] = z * cos_t + y * sin_t;
    }
};

var shadeColor = function (color, percent) {

	var f = parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
};

function Shape(type, options){

	this.scale = {
		x: 1,
		y: 1,
		z: 1
	};
	
	this.position = {
		x: 0,
		y: 0,
		z: 0
	};
	
	this.velocity = {
		x: 0,
		y: 0,
		z: 0
	};
	
	this.rotation = {
		x: 0,
		y: 0,
		z: 0
	};
	
	this.material = {
		bounce: 0,
		resistance: 1,
		mass: 1,
		color: 	'#cccccc'
	};
	
	this.vertices = [];
	this.edges = [];
	this.faces = [];
		
	switch (type) {
		
		case 'cube':
		
			this.render = function (width, height, ctx, camera, sun) {
						
				var sx = this.scale.x*5*camera.distance,
					sy = this.scale.y*5*camera.distance,
					sz = this.scale.z*6*camera.distance,
					px = this.position.x*5*camera.distance,
					py = this.position.y*5*camera.distance,
					pz = this.position.z*6*camera.distance,
					cx = camera.position.x*5*camera.distance,
					cy = camera.position.y*5*camera.distance;
									
				//translate to center
				ctx.translate(width/2 + px + py - cx - cy, height/2 + px/5*3 - py/5*3 - cx/5*3 + cy/5*3 - pz);
				
				//draw shadow
				ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
				ctx.beginPath();
				ctx.moveTo( pz, 0 + pz);
				ctx.lineTo( -sx + pz, -( sx/5*3) + pz);
				ctx.lineTo( sy - sx + +pz, -( sy/5*3 + sx/5*3) + pz);
				ctx.lineTo( sy - sx + pz + sz, -( sy/5*3 + sx/5*3) + pz);
				ctx.lineTo( sy + pz + sz, -(sy/5*3) + pz);
				ctx.lineTo( pz + sz, pz);
				ctx.fill();
				
				//draw right and left side if we have height, if not draw plain
				if(sz > 0){
					
					if(sx > 0){
						//draw left side
						ctx.fillStyle = shadeColor(this.material.color, -sun*0.8);
						ctx.beginPath();
						ctx.moveTo(0,0);
						ctx.lineTo( -sx, -sx/5*3 );
						ctx.lineTo( -sx, -( sx/5*3 + sz ));
						ctx.lineTo( sy - sx, -( sy/5*3 + sx/5*3 + sz ) );
						ctx.lineTo( sy, -( sy/5*3 + sz ));
						ctx.fill();
					}
					
					if(sy > 0){
						//draw right side
						ctx.fillStyle = shadeColor(this.material.color, sun*0.8);
						ctx.beginPath();
						ctx.moveTo(0,0);
						ctx.lineTo( sy, -sy/5*3 );
						ctx.lineTo( sy, -( sy/5*3 + sz ));
						ctx.lineTo(0, -sz );
						ctx.fill();
					}
				}
				
				//draw top only if we have both a width and depth
				if(this.scale.y > 0 && this.scale.x > 0){
				
					//draw top
					ctx.fillStyle = shadeColor(this.material.color, -sun*sun+ 0.5);
					ctx.beginPath();
					ctx.moveTo( 0, -sz );
					ctx.lineTo( -sx, -( sx/5*3 + sz ));
					ctx.lineTo( sy - sx, -( sy/5*3 + sx/5*3 + sz ));
					ctx.lineTo( sy, -(sy/5*3 + sz ));
					ctx.fill();
					
				}
								
				ctx.translate( -(width/2 + px + py - cx - cy), -(height/2 + px/5*3 - py/5*3 - cx/5*3 + cy/5*3 - pz));
				
			}
			
			break;
			
		case 'pyramid':
		
			this.render = function (width, height, ctx, camera, sun) {
				
				var sx = this.scale.x*5*camera.distance,
					sy = this.scale.y*5*camera.distance,
					sz = this.scale.z*6*camera.distance,
					px = this.position.x*5*camera.distance,
					py = this.position.y*5*camera.distance,
					pz = this.position.z*6*camera.distance,
					cx = camera.position.x*5*camera.distance,
					cy = camera.position.y*5*camera.distance;
									
				//translate to center
				ctx.translate(width/2 + px + py - cx - cy, height/2 + px/5*3 - py/5*3 - cx/5*3 + cy/5*3 - pz);
				
				
				//draw right and left side if we have height
				if(this.scale.z > 0){
				
					if(this.scale.y > 0 && this.scale.x > 0){
						
						//draw back left side
						ctx.fillStyle = shadeColor(this.material.color, -sun*0.2);
						ctx.beginPath();
						ctx.moveTo(-sx, -sx/5*3);
						ctx.lineTo( sy - sx, -( sy/5*3 + sx/5*3 ));
						ctx.lineTo( sy, -sy/5*3);
						ctx.fill();
						
						//draw back right side
						ctx.fillStyle = shadeColor(this.material.color, sun*0.3);
						ctx.beginPath();
						ctx.moveTo(0, 0);
						ctx.lineTo( sy - sx, -( sy/5*3 + sx/5*3 ));
						ctx.lineTo( sy, -sy/5*3);
						ctx.fill();
						
					}
					
					if(this.scale.x > -1){
										
						//draw left side
						ctx.fillStyle = shadeColor(this.material.color, -sun*0.6);
						ctx.beginPath();
						ctx.moveTo(0,0);
						ctx.lineTo(-sx, -sx/5*3);
						ctx.lineTo( (sy - sx)/2, -( sy/5*3 + sx/5*3 )/2 - sz);
						ctx.lineTo(sy, -sy/5*3);
						ctx.fill();
						
					}
					
					if(this.scale.y > 0){
					
						//draw right side
						ctx.fillStyle = shadeColor(this.material.color, sun*0.6);
						ctx.beginPath();
						ctx.moveTo(0,0);
						ctx.lineTo( (sy - sx)/2, -( sy/5*3 + sx/5*3 )/2 - sz);
						ctx.lineTo(sy, -sy/5*3);
						
						ctx.fill();
					
					}
					
					
				} else {
					
					//draw plain
					ctx.fillStyle = shadeColor(this.material.color, sun*sun*1);
					ctx.beginPath();
					ctx.moveTo( 0, 0 );
					ctx.lineTo( -sx, -sx/5*3);
					ctx.lineTo( sy - sx, -( sy/5*3 + sx/5*3 ));
					ctx.lineTo( sy, -sy/5*3);
					ctx.fill();
					
				}
							
				
				ctx.translate( -(width/2 + px + py - cx - cy), -(height/2 + px/5*3 - py/5*3 - cx/5*3 + cy/5*3 - pz));
				
			}
			
			break;
			
		case 'plain':
		
			this.render = function (width, height, ctx, camera, sun) {
			
				var sx = this.scale.x*5*camera.distance,
					sy = this.scale.y*5*camera.distance,
					sz = this.scale.z*6*camera.distance,
					px = this.position.x*5*camera.distance,
					py = this.position.y*5*camera.distance,
					pz = this.position.z*6*camera.distance,
					cx = camera.position.x*5*camera.distance,
					cy = camera.position.y*5*camera.distance;
														
				//translate to center
				ctx.translate( window.innerWidth/2 + sx + sy - cx - cy, width/2 + this.x*2*angle*distance - this.y*2*angle*distance - camera[0]*2*distance*angle + camera[1]*2*distance*angle);
				
				//draw top only if we have both a width and depth
				if(this.d > 0 && this.w > 0){
					
					//draw top
					ctx.fillStyle = shadeColor(this.material.color, -sun*sun+ 0.5);
					ctx.beginPath();
					ctx.moveTo(0,0);
					ctx.lineTo(-this.w*4*distance, -(this.w*2*angle*distance));
					ctx.lineTo(this.d*4*distance-this.w*4*distance, -(this.d*2*angle*distance + this.w*2*angle*distance) );
					ctx.lineTo(this.d*4*distance, -(this.d*2*angle*distance));
					ctx.fill();
					
				}
				
				ctx.translate(-( window.innerWidth/2 + this.x*4*distance + this.y*4*distance - camera[0]*4*distance - camera[1]*4*distance), -( window.innerHeight/2 + this.x*2*angle*distance - this.y*2*angle*distance - camera[0]*2*angle*distance + camera[1]*2*distance*angle));
				
			}
			
			break;
			
		case 'cubeoid':
		
			var px = this.position.x,
				py = this.position.y,
				pz = this.position.z,
				sx = this.scale.x,
				sy = this.scale.y,
				sz = this.scale.z;
			
			this.vertices = [
				[this.position.x-this.scale.x/2,   this.position.y-this.scale.z/2,   pz-sy/2],
				[px-sx/2,   py-sz/2,   pz-sy/2+sy],
				[px-sx/2,   py-sz/2+sz, pz-sy/2],
				[px-sx/2,   py-sz/2+sz, pz-sy/2+sy],
				[px-sx/2+sx, py-sz/2,   pz-sy/2],
				[px-sx/2+sx, py-sz/2,   pz-sy/2+sy],
				[px-sx/2+sx, py-sz/2+sz, pz-sy/2],
				[px-sx/2+sx, py-sz/2+sz, pz-sy/2+sy]
			];
			
			this.edges = [
				[0, 1], [1, 3], [3, 2], [2, 0],
			    [4, 5], [5, 7], [7, 6], [6, 4],
			    [0, 4], [1, 5], [2, 6], [3, 7]
			];
			
			this.render = function (width, height, ctx, camera) {
			
				//translate position
				ctx.translate(width/2, height/2);
			
				var add = 5;
				
			    for (var e = 0; e < this.edges.length; e++) {
			        var n0 = this.edges[e][0];
			        var n1 = this.edges[e][1];
			        var node0 = this.vertices[n0];
			        var node1 = this.vertices[n1];
			        
			        var n0X = (node0[0]) * add * camera.distance;
			        var n0Y = (node0[1]) * add * camera.distance;
			        var n1X = (node1[0]) * add * camera.distance;
			        var n1Y = (node1[1]) * add * camera.distance;
			        
			        ctx.strokeStyle = 'white';
			        ctx.beginPath();
			        ctx.moveTo( n0X, n0Y);
			        ctx.lineTo( n1X, n1Y);
			        ctx.stroke();
			    }
			    
			    //translate back
			    ctx.translate(-(width/2), -(height/2)); 
			
			};
			
			break;
			
		default:
			console.error('missing shape type');
			break;
		
	}
	
	if(options !== undefined){
	
		if(options.scale 	!== undefined && typeof options.scale === 'object') this.scale = options.scale;
		if(options.position !== undefined && typeof options.position === 'object') this.position = options.position;
		if(options.rotation !== undefined && typeof options.rotation === 'object') this.rotation = options.rotation;
		if(options.velocity !== undefined && typeof options.velocity === 'object') this.velocity = options.velocity;
		if(options.material !== undefined && typeof options.material === 'object') this.material = options.rotation;
	
	}

};	


Shape.prototype.update = function () {};

Shape.prototype.render = function () {};
		
Shape.prototype.physics = function (gravity) {
								
	this.velocity.z -= gravity;
	
	this.position.x += this.velocity.x;
	this.position.y += this.velocity.y;
	this.position.z += this.velocity.z;
	
	
	if(this.position.z < 0){
		
		this.velocity.z *= -this.material.bounce;
		if (this.material.resistance > 0) this.velocity.x *= 1-this.material.resistance;
		if (this.material.resistance > 0) this.velocity.y *= 1-this.material.resistance;
		this.position.z = 0;
		
	} 		
	
};
			
Shape.prototype.applyForce = function (vector) {

	if(vector !== undefined && vector instanceof Vector){
		this.velocity.x += vector.x;
		this.velocity.y += vector.y;
		this.velocity.z += vector.z;
	}
					
};

Shape.prototype.applyForceX = function (x) {
	if(x !== undefined && typeof x === 'number') this.velocity.x += x;
};

Shape.prototype.applyForceY = function (y) {
	if(y !== undefined && typeof y === 'number') this.velocity.y += y;
};

Shape.prototype.applyForceZ = function (z) {
	if(z !== undefined && typeof z === 'number') this.velocity.z += z;
};

Shape.prototype.setVelocityX = function (x) {
	if(x !== undefined && typeof x === 'number') this.velocity.x = x;
};

Shape.prototype.setVelocityY = function (y) {
	if(y !== undefined && typeof y === 'number') this.velocity.y = y;
};

Shape.prototype.setVelocityZ = function (z) {
	if(z !== undefined && typeof z === 'number') this.velocity.z = z;
};

Shape.prototype.setPosition = function (point) {
	
	if(point !== undefined && typeof point === 'object'){
		this.position.x += point.x;
		this.position.y += point.y;
		this.position.z += point.z;
	}
	
};

Shape.prototype.setPositionX = function (x) {
	if(x !== undefined && typeof x === 'number') this.position.x = x;
};

Shape.prototype.setPositionY = function (y) {
	if(y !== undefined && typeof y === 'number') this.position.y = y;
};

Shape.prototype.setPositionZ = function (z) {
	if(z !== undefined && typeof z === 'number') this.position.z = z;
};

Shape.prototype.setRotation = function (vector) {
	
	if(vector !== undefined && typeof vector === 'object'){
		this.rotation.x += vector.x;
		this.rotation.y += vector.y;
		this.rotation.z += vector.z;
	}
	
};

Shape.prototype.setRotationX = function (x) {
	if(x !== undefined && typeof x === 'number') this.rotation.x = x;
};

Shape.prototype.setRotationY = function (y) {
	if(y !== undefined && typeof y === 'number') this.rotation.y = y;
};

Shape.prototype.setRotationZ = function (z) {
	if(z !== undefined && typeof z === 'number') this.rotation.z = z;
};