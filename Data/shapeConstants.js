  const featureFIR = {
    style: function(feature) {
        if (feature.properties.name.includes("FIR")) {
             return {color: "#4b0082"}; // indigo
        }
    },
	filter: function(feature, layer) {
	if(feature.properties.name.includes("FIR")){
        return feature.properties.name;
		}
        
    }
}
const featureTMA = {
    style: function(feature) {
        if(feature.properties.name.includes("TMA")) {
            return {color: "#0000ff"}; // blue
			} 
    },
	filter: function(feature, layer) {
	if(feature.properties.name.includes("TMA")){
        return feature.properties.name;
		}
        
    }
}
const featureCTR = {
    style: function(feature) {
        if (feature.properties.name.includes("CTR")) {
             return {color: "#ffa500"}; // orange
        }
    },
	filter: function(feature, layer) {
	if(feature.properties.name.includes("CTR")){
        return feature.properties.name;
		}
        
    }
}