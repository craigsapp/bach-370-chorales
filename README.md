370 four-part chorales by Johann Sebastian Bach
===============================================

Four-part chorales collected after J.S. Bach's death by his son
C.P.E. Bach (and finished by Kirnberger, J.S. Bach's student, after
C.P.E. Bach's death). Ordered by Breitkopf & Härtel numbers.

The first complete edition of these chorales was published by Breitkopf &
Härtel between 1784&ndash;1787 in four volumes. The first incomplete
edition consisting of 200 chorales in two volumes was published by
Friedrich Wilhelm Birnstiel in 1765 & 1769, reprinted in 1975 by Georg
Olms.

This digital edition is referenced against the fourth edition of the
chorales by Breitkopf & Härtel, c. 1875: 371 vierstimmige Choralgesänge
von Johann Sebastian Bach. 4th ed. by Alfred Dörffel. Breitkopf &
Härtel, Leipzig [c. 1875]. 178 pp. Plate Number: V.A.10. Retypeset
c. 1915 as Edition Breitkopf 10. Reprinted by Associated Music Publishers,
Inc., New York [c. 1940].  A scan of the original edition can be viewed on
[IMSLP](https://imslp.org/wiki/Special:ReverseLookup/495149)).

The source edition has 371 chorales, but chorale 150 is not a four-part
chorale, so it has been omitted from this analytic edition of the
chorales.  However the numbering of the chorales is maintained as in
the source edition, with file `chor150.krn` not being included in this
digital edition.


Online notation for the chorales
-------------------------------

Try out the [Bach chorale
typesetter](https://chorales.sapp.org/typesetter) which allows you to
manipulate the notation of the chorales and transpose them as well as
generate excerpts of them.

<img width="800" alt="Bach chorale typesetter" src="https://user-images.githubusercontent.com/3487289/50733002-1f80c000-1153-11e9-8a3f-795c48714a8e.png">

They are also available in the [Verovio Humdrum
Viewer](http://verovio.humdrum.org/?file=chorales), where you can edit
the musical content and listen to the music.

<img width="800" alt="Verovio Humdrum Viewer" src="https://user-images.githubusercontent.com/3487289/50733024-5f47a780-1153-11e9-8cf6-1a02f8543b8a.png">



Data processing tools and other resources
=========================================

These digital scores can also be found as a submodule in the 
[humdrum-data](https://github.com/humdrum-tools/humdrum-data) repository.

This digital edition is in the Humdrum file format.  Tools for processing files in this format can be found online at:

   https://github.com/humdrum-tools

These digital scores may also be found on the kernScores website:

     http://kernscores.stanford.edu/browse?l=370chorales

with mirrors at:

     http://kern.humdrum.org/browse?l=370chorales
     http://kern.ccarh.org/browse?l=370chorales

which includes dynamic conversions to other data formats.  

The Humdrum Extras command-line programs can download the files from kernScores.  A quick method of downloading:

```bash
    mkdir chorales
    cd chorales
    humsplit h://370chorales
```

To get online access to a single chorale, for example to transpose the first chorale to C major:

```bash
   transpose -k c h://370chorales/chor001.krn
```

To interface to the Humdrum Toolkit commands, use the humcat command to download to standard input (the -s option is needed when downloading multiple files):

```bash
   humcat -s h://370chorales | census -k
```


Makefile
========

The makefile provided in the base directory includes example data
processing commands.  Type "make" when in the same directory as the
makefile to list the commands that can be run with the makefile.


