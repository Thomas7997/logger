import os
import time
import datetime

class LOG :    
    def __init__(self, destinationPath) :
        self.destinationPath = ""
        self.index = 0
        self.setDestination(destinationPath)

    def setDestination(self, path) :
        if not path :
            print("You must enter a path to set the destination.")
        else :
            # Check if path exists or path of parent exists
            if os.path.exists(path) and os.path.isfile(path) :
                self.destinationPath = path
            else :
                try :
                    parentIndex = path.rindex('/')
                    parent = path[:parentIndex]
                except ValueError:
                    print(f"An error occured while getting the path parent : {ValueError}")
                    parent = ""
                if parent and os.path.exists(parent) :
                    # New file's path will be the stored destination
                    f = open(path, 'w')
                    self.destinationPath = path
    
    def log(self, message) :
        d = datetime.datetime.fromtimestamp(time.time())
        if self.destinationPath :
            f = open(self.destinationPath, 'a')
            if self.index == 0 :
                f.write(f"\n---- Script start ---- on '{self.destinationPath}'\n")
            filenameIndex =  __file__.rindex('/')
            filename = __file__[filenameIndex+1:]
            logstr = f"{d} | [{filename}] | ({self.index})       {message}\n"
            f.write(logstr)
            self.index += 1
        else :
            print("No log destination set yet.")

"""

import sys
sys.path.insert(1,destPath)
import logger
from logger import LOG
internal = new LOG(logPath)
internal.log("Log message 1")

"""