from pyvirtualdisplay import Display

from selenium import webdriver
from selenium.webdriver.common.keys import Keys

from threading import Thread, Semaphore
import time

class Barrier:
    def __init__(self, n):
        self.n = n
        self.count = 0
        self.mutex = Semaphore(1)
        self.barrier = Semaphore(0)

    def wait(self):
        self.mutex.acquire()
        self.count = self.count + 1
        self.mutex.release()
        if self.count == self.n: self.barrier.release()
        self.barrier.acquire()
        self.barrier.release()

class playerThread(Thread):
    def __init__(self, gB):
        Thread.__init__(self)
        self.gameBarrier = gB

    def run(self):
        driver = webdriver.Chrome("./chromedriver")
        driver.get("http://www.computerwizforcoding.com:4200")
        #assert "Python" in driver.title

        self.gameBarrier.wait()

        ace_content = driver.find_element_by_class_name("ace_text-input")
        ace_content.send_keys("while(1){ MAGIC.castFireBall(0,5,10);}")
        ace_content.send_keys(Keys.RETURN)

        checkSpell_button = driver.find_element_by_xpath("//input[@onclick='submitSpell()']")
        checkSpell_button.click()

        readyToFight_button = driver.find_element_by_xpath("//input[@onclick='readyToFight()']")
        readyToFight_button.click()

        wholePage = driver.find_element_by_tag_name("body")
        wholePage.send_keys('1')
        while not terminate:
            for i in range(1,10):
                wholePage.send_keys(Keys.ARROW_UP)
            time.sleep(.1)

        driver.close()

terminate = False
barrier = Barrier(2)

display = Display(visible=0, size=(800,600))
display.start()

threads = []
numGame = 2
for i in range(1,numGame + 1):
    barrier = Barrier(2)
    p1 = playerThread(barrier)
    p2 = playerThread(barrier)
    p1.start()
    p2.start()
    threads.append(p1)
    threads.append(p2)

# infinite loop
while(1):
    pass
time.sleep(120)
terminate = True

for thread in threads:
    Thread.join(thread)

display.stop()
