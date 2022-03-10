#!/usr/bin/perl

# <rdar://problem/7226291> iPhoto - Missing Libraries after installing 10.6 - EyeFi has a bug that will put user data into /Volumes
# We need to examine /Volumes on the dead 'old' system that is been migrated from automatically during an upgrade install.
# If we find files or a non empty directoty, this could be eyeFi data, or other mispaced user files.

# This script will move such files to a top-level directory, passed as the second argument...

if (@ARGV != 2) {
  print STDERR "Usage: $0 path_to_Volume_dir safe_Volume\n";
  exit 1;
}

if (!$ENV{"SRCROOT"}) {
   print STDERR "SRCROOT not set\n";
   exit 1;
}

if (! -e $ARGV[1]) {
    mkdir($ARGV[1]);
}

chdir($ENV{"SRCROOT"} . "/" . $ARGV[0]);
opendir(DIR, $ENV{"SRCROOT"} . "/" . $ARGV[0]);
foreach my $file (readdir DIR) {
	# skip links, pipes, devices etc..
	next if ($file eq "." or $file eq ".." or $file eq ".DS_Store");
	my $fullpath = "$ENV{SRCROOT}/$ARGV[0]/$file";
	my @stat = stat($fullpath);
	my $nlink = $stat[3];
	next if (-l $fullpath or -b $fullpath or -S $fullpath or -c $fullpath or -p $fullpath);
	next if (-e "$fullpath/.autodiskmounted");
	next if (-d $fullpath and $nlink <= 2);
	
	system("mv", $fullpath, $ARGV[1]);
}
closedir DIR;

