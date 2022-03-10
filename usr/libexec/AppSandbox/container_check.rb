#!/usr/bin/env ruby
#
# Copyright (c) 2011-2019 Apple Inc. All rights reserved.
#
# @APPLE_LICENSE_HEADER_START@
#
# This file contains Original Code and/or Modifications of Original Code
# as defined in and that are subject to the Apple Public Source License
# Version 2.0 (the 'License'). You may not use this file except in
# compliance with the License. Please obtain a copy of the License at
# http://www.opensource.apple.com/apsl/ and read it before using this
# file.
#
# The Original Code and all software distributed under the License are
# distributed on an 'AS IS' basis, WITHOUT WARRANTY OF ANY KIND, EITHER
# EXPRESS OR IMPLIED, AND APPLE HEREBY DISCLAIMS ALL SUCH WARRANTIES,
# INCLUDING WITHOUT LIMITATION, ANY WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT OR NON-INFRINGEMENT.
# Please see the License for the specific language governing rights and
# limitations under the License.
#
# @APPLE_LICENSE_HEADER_END@
#

ENV["PATH"] = "/bin:/usr/bin:/usr/sbin"

require 'ostruct'
require 'pp'
require 'optparse'
require 'tempfile'
require 'find'


class ContainerChecker
    def initialize(home, output, outIO)
        @homeDirPath = home
        @fulloutput = output		
        @containerPath = File.join(@homeDirPath, "Library", "Containers")
        @outputIO = outIO
    end
    
    def fileInfo(filePath)
        outputLines = `ls -leOd "#{filePath}"`.split("\n")
        if outputLines.nil? || outputLines.length == 0 then
            firstLine = "<unreadable>"
        else
            #firstLine = outputLines[0].gsub(/ \/.*$/, '')
            firstLine = outputLines[0]
        end
        acls = ""
        if (!outputLines.nil? && outputLines.length > 1) then
            outputLines.delete_at(0)
            acls = " {" + outputLines.join(",") + "}"
        end
        
        firstLine + acls
    end
    
    def checkLink(filePath)
        if File.symlink?(filePath) then
            link = File.readlink(filePath)
            # expand_path handles absolute paths 
            p = File.expand_path(link, File.dirname(filePath))
            @outputIO.printf("\t\t[LINK] %s\n", fileInfo(p))
        end
    end
    
    def _indentString(str, level)
        indentString = "\t" * level
        str.each_line do |line|
            @outputIO.printf("%s%s", indentString, line)
        end
    end
    
    def checkPathToContainer
        p = @containerPath
        infos = Array.new
        while p != "/"
            info = OpenStruct.new
            info.lsOutput = fileInfo(p)
            info.baseName = File.basename(p)
            info.isSymlink = File.symlink?(p)
            info.path = p
            infos << info
            p = File.dirname(p)
        end
        # get root too
        info = OpenStruct.new
        info.lsOutput = fileInfo(p)
        info.baseName = File.basename(p)
        info.path = p
        infos << info
        
        @outputIO.printf("Path to Containers directory:\n")
        infos.reverse!
        infos.each_index do |idx|
            @outputIO.printf("\t%s", infos[idx].lsOutput);
            checkLink(infos[idx].path)
            @outputIO.printf("\n")
        end
    end
    
    def checkFilesInHomeDir
        @outputIO.printf("Files in home directory:\n");
        ["Desktop", "Documents", "Downloads", "Library", "Movies", "Music", "Pictures", "Library/Preferences"].each do |file|
            filePath = File.join(@homeDirPath, file)
            @outputIO.printf("\t%s\n", fileInfo(filePath))
            checkLink(filePath)
        end
    end
    
    def containerRoots
        containers = Array.new
        if File.readable?(@containerPath) then
            Dir.foreach(@containerPath) do |f|
                if (f != ".") && (f != "..") then
                    containers << File.join(@containerPath, f)
                end
            end
        else 
            @outputIO.printf("Container path not readable.\n")
        end
        containers
    end
    
    def _checkContainer(containerRootPath)
        if !File.directory?(containerRootPath) then
            @outputIO.printf("Not a container: [%s]\n", fileInfo(containerRootPath))
            @outputIO.printf("\n\n")
            return
        end
        
        containerIdentifier = File.basename(containerRootPath)
        @outputIO.printf("Container: %s [%s]\n", containerIdentifier, fileInfo(containerRootPath))
        
        containerInfoPlistPath = File.join(containerRootPath, "Container.plist")
        if File.size?(containerInfoPlistPath) then
            @outputIO.printf("\t ACLs:\n")
            output = `asctl container acl list --container-path #{containerRootPath} 2>&1`
            output.each_line {|l| @outputIO.printf("\t\t%s", l)}
            
            #@outputIO.printf("%s", output)
        else 
            @outputIO.printf("\t NO Container.plist!!\n")
        end
	
	@outputIO.printf("\t Files in Container:\n")
	Dir.foreach(containerRootPath) {|f| @outputIO.printf("\t\t%s\n", fileInfo(File.join(containerRootPath, f))) }

        if @fulloutput then
            @outputIO.printf("\t Files in Data:\n")
            #_indentString(`ls -lRa "#{containerRootPath}"`, 2)
            dataDir = File.join(containerRootPath, "Data")
            if !File.exists?(dataDir) then
                @outputIO.printf("\t Data directory does not exist.\n");
            elsif !File.directory?(dataDir) then
                @outputIO.printf("\t Data directory is not a directory: [%s]\n", fileInfo(dataDir));
            else 
                Dir.foreach(dataDir) {|f| @outputIO.printf("\t\t%s\n", fileInfo(File.join(dataDir, f))) }
                
		containerPrefsDir = File.join(dataDir, "Library/Preferences")
		@outputIO.printf("\t\t%s\n", fileInfo(containerPrefsDir))
                Dir.foreach(containerPrefsDir) {|f| @outputIO.printf("\t\t%s\n", fileInfo(File.join(containerPrefsDir, f))) }
		
		oldDataDir = File.join(containerRootPath, "OldData")
		if File.exists?(oldDataDir) then
			@outputIO.printf("\t Files in OldData:\n")
			Find.find(oldDataDir) do |path|
				@outputIO.printf("\t\t%s\n", fileInfo(path))
			end
		end

                if File.exists?(containerInfoPlistPath) then
                    @outputIO.printf("\t Content of Container.plist:\n")
                    output = `plutil -convert xml1 -o - "#{containerInfoPlistPath}"`
                    output.each_line {|l| @outputIO.printf("\t\t%s", l)}
                end
            end
        end
        
        @outputIO.printf("\n\n")
        
    end
    
    def checkAllContainers
        @outputIO.printf("Containers: %s\n\n", @containerPath)
        containerRoots().each do |containerRoot|
            _checkContainer(containerRoot)
        end
    end
    
    def checkContainer(identifier)
        containerRootPath = File.join(@containerPath, identifier)
        _checkContainer(containerRootPath)
    end
    
end


if __FILE__ == $0
    options = OpenStruct.new
    
    options.fulloutput = true
    options.container = nil
    options.useSTDOUT = nil
    options.userName = nil;
    
    opts = OptionParser.new
    opts.banner = "usage: #{$0} [Options]"
    
    opts.on("-f", "--full-output",			"full listing of container contents")       {|val| options.fulloutput = val}
    opts.on("-s", "--short-output",			"just info about container")                {|val| options.fulloutput = nil}
    opts.on("-c", "--container PLIST_FILE",		"info about this container")                {|val| options.container = val}
    opts.on("-o", "--stdout",                           "send output to stdout")                    {|val| options.useSTDOUT = val}
    opts.on("-u", "--for-user USER",                    "check containers for the given user")      {|val| options.userName = val}

    begin
        # parse ARGV in order and terminate processing on the first unregonized arg
        otherArgs = opts.order(ARGV) {|val| opts.terminate(val)}
	rescue OptionParser::ParseError => error
        puts error.message
        puts opts
        exit
    end
    
    if options.useSTDOUT then
        outputFileIO = STDOUT
    else 
        outputFileName = "/tmp/container_info_#{$$}.txt"
        outputFileIO = File.open(outputFileName, "w")
    end
    
    # pp options
    homeDirectoryPath = options.userName.nil? ? ENV["HOME"] : Etc.getpwnam(options.userName).dir
            
    cc = ContainerChecker.new(homeDirectoryPath, options.fulloutput, outputFileIO)
    
    cc.checkPathToContainer
    outputFileIO.printf("\n\n");
    cc.checkFilesInHomeDir
    outputFileIO.printf("\n\n");

    if options.container then
        cc.checkContainer(options.container)
	else
        cc.checkAllContainers
    end
    
    if options.useSTDOUT.nil? then 
        printf("Output file: %s\n", outputFileName);
    end
end
