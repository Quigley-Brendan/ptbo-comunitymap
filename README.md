# PTBO Community Map Google API Code

The goal of this map is to display multiple reference layers for teh City of Peterborough, Ontario. Currently there is only the boundary and some known city areas included. 

Other layers to be included are:

School Zones
Entertainment
Trails
Medical Locations
etc.

All layers are created as .shp files in QGIS and saved as GeoJson to be imported into the Google Maps API. 

A data structre for the .shp files will be created so all of the layers can pull there specific settings directly from the layers. This is in an attempt to reduce code in the main JS script. 

Stay Tuned.
