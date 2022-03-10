#!/usr/bin/ruby

# <rdar://problem/7226291> iPhoto - Missing Libraries after installing 10.6 - EyeFi has a bug that will put user data into /Volumes
# We need to examine /Volumes on the dead 'old' system that is been migrated from automatically during an upgrade install.
# If we find files or a non empty directoty, this could be eyeFi data, or other mispaced user files.

# This script will move such files to a top-level directory, passed as the second argument...

require 'fileutils'

if ARGV.size != 2
  $stderr.puts "Usage: #{__FILE__} path_to_Volume_dir safe_Volume"
  exit 1
end

if !ENV["SRCROOT"] 
   $stderr.puts "SRCROOT not set";
   exit 1
end

if !File.exists?(ARGV[1])
    FileUtils.mkdir(ARGV[1]);
end

Dir.chdir(ENV["SRCROOT"]+ARGV.first);
Dir.foreach(".") { |file|
    # skip links, pipes, devices etc..
    if file == "." || file == ".." || file ==".DS_Store"
	 next;
    end
    fullPath = File.expand_path(file);
    if File.symlink?(fullPath) || File.chardev?(fullPath) || File.blockdev?(fullPath) || File.socket?(fullPath) || File.pipe?(fullPath)
	next;
    end
    # set when directory is managed mountpoint
    if File.exists?(fullPath+"/.autodiskmounted")
	next;
    end
    # empty directory
    if File.directory?(fullPath)
    	if Dir.entries(fullPath).size <= 2
		next;
    	end
    end
    FileUtils.mv fullPath , ARGV[1], :verbose=>true, :noop => false;
}

