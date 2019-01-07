## bach-370-chorales Makefile
##
## Programmer:    Craig Stuart Sapp <craig@ccrma.stanford.edu>
## Creation Date: Sun May 25 23:27:32 PDT 2014
## Last Modified: Sun May 25 23:27:35 PDT 2014
## Filename:      Makefile
## Syntax:        GNU makefile
##
## Description: 
##
## Makefile for basic processing Humdrum data files for J.S. Bach's
## 4-part chorales.
##
## To run this makefile, type "make" (without quotes) to see a list 
## of the makefile actions which can be done.
##

# targets which don't actually refer to files/directories:
.PHONY : abc kernscores lilypond lilypond-gs mei mei-gs midi midi-norep musedata musedata-gs musicxml musicxml-gs notearray pdf-abc pdf-abs-gs pdf-lilypond pdf-lilypond-gs pdf-musedata pdf-musedata-gs

all:
	@echo ''
	@echo 'Run this makefile with one of the following labels:'
	@echo '   "make update"      : download any new changes from online repository.'
	@echo '   "make clean"       : delete data directories created by this makefile.'
	@echo ''
	@echo 'Commands requiring the Humdrum Toolkit to be installed:'
	@echo '   "make census"      : run the census command on all files.'
	@echo ''
	@echo 'Commands requiring Humdrum Extras to be installed.'

	@echo '   "make abc"         : convert to ABC+ files.'
	@echo '   "make abc-gs"      : create Grand-Staff ABC+ files.'
	@echo '   "make kernscores"  : download equivalent from kernscores.'
	@echo '   "make mei"         : convert to MEI files.'
	@echo '   "make mei-gs"      : convert to MEI (Grand Staff layout).'
	@echo '   "make midi"        : convert to MIDI files (full repeats)'
	@echo '   "make midi-norep"  : convert to MIDI files (no repeats)'
	@echo '   "make musedata"    : convert to MuseData files.'
	@echo '   "make musedata-gs" : create Grand-Staff MuseData files.'
	@echo '   "make musicxml"    : convert to MusicXML files.'
	@echo '   "make musicxml-gs" : convert to Grand-Staff format.'
	@echo '   "make notearray"   : create notearray files.'
	@echo '   "make searchindex" : create themax search index.'

	@echo ''
	@echo 'Commands requiring other software to be installed.'
	@echo '   "make pdf-abc"     : convert to PDF files with abcm2ps.'
	@echo '   "make pdf-abc-gs"  : PDF files in Grand Staff layout.'
	@echo '   "make pdf-lilypond": convert to PDF files with lilypond.'
	@echo '   "make pdf-lilypond-gs": PDF files in Grand Staff layout.'
	@echo '   "make pdf-musedata": convert to PDF files with muse2ps.'
	@echo '   "make pdf-musedata-gs": PDF files in Grand Staff layout.'
	@echo ''


############################################################################
##
## General make commands:
##

##############################
#
# make update -- Download any changes in the Github repositories for
#      each composer.  To download for the first time, type:
#           git clone https://github.com/craigsapp/bach-370-chorales
#

update:       github-pull
pull:         github-pull
github:       github-pull
githubupdate: github-pull
githubpull:   github-pull
github-pull:
	git pull



##############################
#
# make clean -- Remove all automatically generated or downloaded data files.  
#     Make sure that you have not added your own content into the directories 
#     in which these derivative files are located; otherwise, these will be 
#     deleted as well.
#

clean:
	-rm -rf abc
	-rm -rf abc-gs
	-rm -rf kernscores
	-rm -rf lilypond
	-rm -rf lilypond-gs
	-rm -rf mei
	-rm -rf mei-gs
	-rm -rf midi
	-rm -rf midi-norep
	-rm -rf musedata
	-rm -rf musedata-gs
	-rm -rf musicxml
	-rm -rf musicxml-gs
	-rm -rf notearray
	-rm -rf pdf-abc
	-rm -rf pdf-abc-gs
	-rm -rf pdf-lilypond
	-rm -rf pdf-lilypond-gs
	-rm -rf pdf-musedata
	-rm -rf pdf-musedata-gs
	-rm searchindex.dat



############################################################################
##
## Humdrum Extras related make commands:
##

##############################
#
# make midi -- Create midi files for chorales, expanding repeats.
#

midi:
	mkdir -p midi
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   thrux $$file | hum2mid --autopan -o midi/`basename $$file .krn`.mid	\
	      --timbres "Bass:i68,v70;Tenor:i70,v75;Alto:i71,v55;Soprano:i74,v80";	\
	done
	@echo "Created midi directory for converted data"



##############################
#
# make midi-norep -- Create notearray files (useful for processing data
# in matlab).  Output is stored in a directory called "notearray".
#

midinorep: midi-norep
midi-norep:
	mkdir -p midi-norep
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   thrux -v norep $$file | hum2mid --autopan -o midi-norep/`basename $$file .krn`.mid	\
	      --timbres "Bass:i68,v70;Tenor:i70,v75;Alto:i71,v55;Soprano:i74,v80";	\
	done
	@echo "Created midi-norep directory for converted data"



##############################
#
# make notearray -- Create notearray files (useful for processing data
# in matlab).  Output is stored in a directory called "notearray".
#

notearray:
	mkdir -p notearray
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   notearray -jicale --mel $$file 				\
		> notearray/`basename $$file .krn`.dat;			\
	done
	@echo "Created notearray directory for converted data"


##############################
#
# make abc -- Create ABC+ files (useful for printing with abcm2ps).
# Output is stored in a directory called "abc".
#

abc:
	mkdir -p abc
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   hum2abc $$file		  				\
		> abc/`basename $$file .krn`.abc;			\
	done
	@echo "Created abc directory for converted data"



##############################
#
# make pdf-abc -- Create PDF files with abcm2ps.
# Output is stored in a directory called "pdf-abc".
#

pdf-abc:
	mkdir -p pdf-abc
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   hum2abc $$file |		  				\
	   abcm2ps - -O - |		  				\
	   ps2pdf -sPAPERSIZE=letter - 					\
		> pdf-abc/`basename $$file .krn`.pdf;			\
	done
	@echo "Created pdf-abc directory for converted data"

#
# Grand-Staff layout of parts:
#

pdf-abc-gs:
	mkdir -p pdf-abc-gs
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   satb2gs $$file | hum2abc |		 			\
	   abcm2ps - -O - |		  				\
	   ps2pdf -sPAPERSIZE=letter - 					\
		> pdf-abc-gs/`basename $$file .krn`.pdf;		\
	done
	@echo "Created pdf-abc-gs directory for converted data"


##############################
#
# make musedata -- Create musedata files (useful for printing with muse2ps).
# Output is stored in a directory called "musedata".
#

musedata:
	mkdir -p musedata
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   autostem $$file | hum2muse   				\
		> musedata/`basename $$file .krn`.msd;			\
	done
	@echo "Created musedata directory for converted data"

musedata-gs:
	mkdir -p musedata-gs
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   satb2gs $$file | autostem | hum2muse   			\
		> musedata-gs/`basename $$file .krn`.msd;		\
	done
	@echo "Created musedata-gs directory for converted data"



##############################
#
# make pdf-musedata -- Create PDF files of graphical notation using muse2ps:
#     http://muse2ps.ccarh.org
#     https://github.com/musedata/muse2ps
# Output is stored in a directory called "pdf-musedata".
#
# To print with this method, you need to install muse2ps from the above
# website, as well as the GhostScript package.  In linux, the ps2pdf
# program can be installed with "yum install ghostscript", or 
# "apt-get install ghostscript".  In OS X if you have installed homebrew:
# "brew install ghostscript", or "port install ghostscript" if you are
# using MacPorts.
#

pdf-musedata:
	mkdir -p pdf-musedata
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   autostem $$file | hum2muse | muse2ps =z16j 			\
	      | ps2pdf -sPAPERSIZE=letter - 				\
		> pdf-musedata/`basename $$file .krn`.pdf;		\
	done
	@echo "Created pdf-musedata directory for converted data"


#
# Grand-Staff layout of parts:
#

pdf-musedata-gs:
	mkdir -p pdf-musedata-gs
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   satb2gs $$file | autostem | hum2muse | muse2ps =z18jv120,140	\
	      | ps2pdf -sPAPERSIZE=letter - 				\
		> pdf-musedata-gs/`basename $$file .krn`.pdf;		\
	done
	@echo "Created pdf-musedata-gs directory for converted data"




##############################
#
# make mei -- Create MEI files (useful for printing with verovio).
# Output is stored in a directory called "mei".
#

MEI: mei
mei:
	mkdir -p mei
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   autostem $$file | hum2mei   				        \
		> mei/`basename $$file .krn`.mei;			\
	done
	@echo "Created mei directory for converted data"

#
# Grand-Staff layout of parts:
#

MEI-gs: mei-gs
mei-gs:
	mkdir -p mei-gs
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   satb2gs $$file |  autostem | hum2mei   			\
		> mei-gs/`basename $$file .krn`.mei;			\
	done
	@echo "Created mei-gs directory for converted data"



##############################
#
# make musicxml -- Create MusicXML files, which are useful for processing with
# various programs/systems.  Output is stored in a directory called "musicxml".
#

musicxml:
	mkdir -p musicxml
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   autostem $$file | hum2xml   					\
		> musicxml/`basename $$file .krn`.xml;			\
	done
	@echo "Created musicxml directory for converted data"

#
# Grand-Staff layout of parts:
#

musicxml-gs:
	mkdir -p musicxml-gs
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   satb2gs $$file |  autostem | hum2xml   			\
		> musicxml-gs/`basename $$file .krn`.xml;		\
	done
	@echo "Created musicxml-gs directory for converted data"



##############################
#
# make lilypond -- Create lilypond files.
# Output is stored in a directory called "lilypond".
#

lilypond:
	mkdir -p lilypond
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   autostem $$file | hum2xml | musicxml2ly - -o-   		\
	       > lilypond/`basename $$file .krn`.ly;			\
	done
	@echo "Created lilypond directory for converted data"

#
# Grand-Staff layout of parts:
#

lilypond-gs:
	mkdir -p lilypond-gs
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   satb2gs $$file | autostem | hum2xml | musicxml2ly - -o-   	\
	       > lilypond-gs/`basename $$file .krn`.ly;			\
	done
	@echo "Created lilypond-gs directory for converted data"



##############################
#
# make pdf-lilypond -- Create lilypond files.
# Output is stored in a directory called "lilypond".
#

pdf-lilypond:
	mkdir -p pdf-lilypond
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   autostem $$file | hum2xml | musicxml2ly - -o-   		\
	   | lilypond -f pdf -o pdf-lilypond/`basename $$file .krn` - ; \
	done
	@echo "Created pdf-lilypond directory for converted data"

#
# Grand-Staff layout of parts:
#

pdf-lilypond-gs:
	mkdir -p pdf-lilypond-gs
	for file in kern/*.krn;						\
	do								\
	   echo Processing $$file;					\
	   satb2gs $$file | autostem | hum2xml | musicxml2ly - -o-   	\
	   | lilypond -f pdf -o pdf-lilypond-gs/`basename $$file .krn` -;\
	done
	@echo "Created pdf-lilypond-gs directory for converted data"



##############################
#
# make kernscores -- Download scores from the kernScores website
#   (http://kern.humdrum.org).  In theory these are the same as the 
#   files in the kern directory.
#

kernscores:
	mkdir -p kernscores; (cd kernscores; humsplit h://370chorales)



##############################
#
# make searchindex -- Create a themax search index file.  The searchindex.dat
# file can be used with the themax program to search for melodic/rhythmic 
# patterns in the data, such as searching for two successive rising 
# perfect fourths:
#
# Counting the number of occurrences within the data (all voices):
#    themax -I "+P4 +P4" searchindex.dat --total
#
# Count the number of matches by each voice separately:
#    grep ::1 searchindex.dat | themax -I "+P4 +P4" --count
#       (finds 53 matches in the bass part)
#    grep ::2 searchindex.dat | themax -I "+P4 +P4" --count
#       (finds 9 matches in the tenor part)
#    grep ::3 searchindex.dat | themax -I "+P4 +P4" --count
#       (finds 0 matches in the alto part)
#    grep ::4 searchindex.dat | themax -I "+P4 +P4" --count
#       (finds 2 matches in the soprano part)
#
# Counting the number of matches in a file:
#    themax -I "+P4 +P4" searchindex.dat --count
#
# Showing the note-number location of the matches:
#    themax -I "+P4 +P4" searchindex.dat --loc
#
# Resolve note-number locations to measure/beat locations:
#    themax -I "+P4 +P4" searchindex.dat --loc | theloc
#
# Extract measures which contain the matches in a particular chorale:
#    tindex kern/chor200.krn | themax -I "+P4 +P4" --loc | theloc --mark | myank --marks
#
#

searchindex:
	tindex kern/*.krn > searchindex.dat



############################################################################
##
## standard Humdrum Toolkit related make commands:
##

##############################
#
# make census -- Count notes in all score for all composers.
#

census:
	census -k kern/*.krn



#############################################################################
##
## Maintenance
##

krns:
	(cd kern; humcat -s chor*.krn > ../all.krns)
