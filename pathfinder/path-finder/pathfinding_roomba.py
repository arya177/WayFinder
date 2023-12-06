import pygame, sys 
from pathfinding.core.grid import Grid
from pathfinding.finder.a_star import AStarFinder
from pathfinding.core.diagonal_movement import DiagonalMovement
import argparse
file_loc = "/Users/tony/projects/WayFinder/pathfinder/path-finder"
# Function to save a screenshot
def save_screenshot(screen, filename):
    pygame.image.save(screen, filename)

class Pathfinder:
    
	def __init__(self,matrix):
		# setup
		self.matrix = matrix
		self.grid = Grid(matrix = matrix)
		self.select_surf = pygame.image.load('/Users/tony/projects/WayFinder/pathfinder/path-finder/selection.png').convert_alpha()

		# pathfinding
		self.path = []

		# Roomba
		self.roomba = pygame.sprite.GroupSingle(Roomba(self.empty_path))
		# self.start_image = pygame.image.load('start.png').convert_alpha()
		# self.destination_image = pygame.image.load('destination.png').convert_alpha()

	def empty_path(self):
		self.path = []

	def draw_active_cell(self):
		mouse_pos = pygame.mouse.get_pos()
		row =  mouse_pos[1] // 32
		col =  mouse_pos[0] // 32
		current_cell_value = self.matrix[row][col]
		if current_cell_value == 1:
			rect = pygame.Rect((col * 32,row * 32),(32,32))
			screen.blit(self.select_surf,rect)

	def create_path(self, final_location,event):

		# start
		start_x, start_y = self.roomba.sprite.get_coord()
		start = self.grid.node(start_x,start_y)
		
		# end
		if event.type == pygame.MOUSEBUTTONDOWN:
			# print("hi")
			mouse_pos = pygame.mouse.get_pos()
			end_x,end_y =  mouse_pos[0] // 32, mouse_pos[1] // 32  
			# print(mouse_pos)
			# end = self.grid.node(end_x,end_y) 
		else: 
			end_x,end_y =  final_location
		end = self.grid.node(end_x,end_y) 

		# path
		finder = AStarFinder(diagonal_movement = DiagonalMovement.always)
		self.path,_ = finder.find_path(start,end,self.grid)
		self.grid.cleanup()
		self.roomba.sprite.set_path(self.path)
	
	def draw_path(self):
		if self.path:
			points = []
			for point in self.path:
				x = (point.x * 32) + 16
				y = (point.y * 32) + 16
				points.append((x,y))

			pygame.draw.lines(screen,'#4a4a4a',False,points,5)

	def update(self):
		self.draw_active_cell()
		self.draw_path()

		# updating and drawing
		self.roomba.update()
		self.roomba.draw(screen)
	def set_roomba_position(self, x, y):
         self.roomba.sprite.rect.center = (x, y)
	
	

class Roomba(pygame.sprite.Sprite):
	def __init__(self,empty_path):

		# basic
		super().__init__()
		self.image = pygame.image.load('/Users/tony/projects/WayFinder/pathfinder/path-finder/roomba.png').convert_alpha()

		self.rect = self.image.get_rect(center =(60,60))

		# movement 
		self.pos = self.rect.center
		self.speed = 2
		self.direction = pygame.math.Vector2(0,0)

		# path
		self.path = []
		self.collision_rects = []
		self.empty_path = empty_path

	def get_coord(self):
		col = self.rect.centerx // 32
		row = self.rect.centery // 32
		return (col,row)

	def set_path(self,path):
		self.path = path
		self.create_collision_rects()
		self.get_direction()

	def create_collision_rects(self):
		if self.path:
			self.collision_rects = []
			for point in self.path:
				x = (point.x * 32) + 16
				y = (point.y * 32) + 16
				rect = pygame.Rect((x - 2,y - 2),(4,4))
				self.collision_rects.append(rect)

	def get_direction(self):
		if self.collision_rects:
			start = pygame.math.Vector2(self.pos)
			end = pygame.math.Vector2(self.collision_rects[0].center)
			self.direction = (end - start).normalize()
		else:
			self.direction = pygame.math.Vector2(0,0)
			self.path = []

	def check_collisions(self):
		if self.collision_rects:
			for rect in self.collision_rects:
				if rect.collidepoint(self.pos):
					del self.collision_rects[0]
					self.get_direction()
		else:
			self.empty_path()

	def update(self):
		self.pos += self.direction * self.speed
		self.check_collisions()
		self.rect.center = self.pos
	def set_coord(self, x, y):
         self.rect.center = (x, y)
	
	
def parse_command_line_args():
    parser = argparse.ArgumentParser(description='Pathfinding with Roomba in Pygame')
    parser.add_argument('--x', type=int, help='Final location x-coordinate', default=None)
    parser.add_argument('--y', type=int, help='Final location y-coordinate', default=None)
    return parser.parse_args()

pygame.init()
screen = pygame.display.set_mode((1280, 768)) #40*24
clock = pygame.time.Clock()

# screenshot_timer = 0
# interval = 1000  # Set the interval in milliseconds (1 second)

bg_surf = pygame.image.load('/Users/tony/projects/WayFinder/pathfinder/path-finder/output_image.png').convert()
matrix = [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0],
	[1,1,1,1,1,1,1,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,1,0],
	[1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0],
	[0,0,0,0,0,1,1,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,1,0],
	[0,0,0,0,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0],
	[0,0,0,0,0,1,1,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,1,0],
	[0,0,0,0,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0],
	[0,0,0,0,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0],
	[0,0,0,0,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0],
	[0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0],
	[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
	[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
	[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
	[0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1,1,1,0],
	[0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0],
	[0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0],
	[0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,1,0,1,1,1,0],
	[0,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0],
	[0,1,1,1,1,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,1,0,1,0,1,0,1,0,1,1,0,1,1,1,0],
	[0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0],
	[0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0,1,0,1,0,1,0,1,1,0,1,1,1,0],
	[0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]]
matrix2 = [
   [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0],
	[1,1,1,1,1,1,1,1,0,1,1,1,0,0,1,0,1,1,1,0,0,1,0,1,1,1,0,0,1,0,1,1,1,0,0,1,0,1,1,0],
	[1,1,1,1,1,1,1,1,0,1,1,1,0,0,1,0,1,1,1,0,0,1,0,1,1,1,0,0,1,0,1,1,1,0,0,1,0,1,1,0],
	[0,0,0,0,0,1,1,1,0,1,1,1,0,0,1,0,1,1,1,0,0,1,0,1,1,1,0,0,1,0,1,1,1,0,0,1,0,1,1,0],
	[0,0,0,0,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0],
	[0,0,0,0,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0],
	[0,0,0,0,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0],
	[0,0,0,0,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0],
	[0,0,0,0,0,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,0],
	[0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0],
	[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
	[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
	[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
	[0,0,0,0,1,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,1,1,0,1,1,1,0],
	[0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0],
	[0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0],
	[0,1,1,1,1,1,1,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0],
	[0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0],
	[0,1,1,1,1,1,1,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0],
	[0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0],
	[0,1,1,1,1,1,1,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,1,0,1,0,1,0,1,0,1,0,1,1,1,0],
	[0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
]
pathfinder = Pathfinder(matrix)
current_matrix_set = matrix 
args = parse_command_line_args()
if args.x is not None and args.y is not None:
    final_location = (args.x, args.y)
    pathfinder.create_path(final_location, event = pygame.event.Event(1))

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            quit()

        if event.type == pygame.MOUSEBUTTONDOWN:
            if event.button == 1:  # Left mouse button
                final_location = pygame.mouse.get_pos()
                pathfinder.create_path(final_location,event)
    

    keys = pygame.key.get_pressed()
    if keys[pygame.K_RETURN]:  # Enter key pressed
        final_location = input("Enter final coordinates (x y): ")
        try:
            final_location = tuple(map(int, final_location.split()))
            pathfinder.create_path(final_location,event)
        except ValueError:
            print("Invalid input. Please enter two integers separated by a space.")

    
    screen.blit(bg_surf, (0, 0))
    pathfinder.update()
    roomba_position = pathfinder.roomba.sprite.get_coord()
    if roomba_position == (0, 1):
        
        # Toggle between the sets of matrices and background images
        if current_matrix_set == matrix:
            
            current_matrix_set = matrix2
            bg_surf = pygame.image.load('/Users/tony/projects/WayFinder/pathfinder/path-finder/output2_image.png').convert()
        else:
           
            current_matrix_set = matrix
            bg_surf = pygame.image.load('/Users/tony/projects/WayFinder/pathfinder/path-finder/output_image.png').convert()

        pathfinder = Pathfinder(current_matrix_set)  # Update the Pathfinder with the new set of matrices
        pathfinder.roomba.sprite.set_coord(60, 60) 

    # screenshot_timer += clock.tick(30)  # Increment the timer
    # if screenshot_timer >= interval:
    #     save_screenshot(screen, "user_loc")
    #     screenshot_timer = 0  # Reset the timer
    pygame.display.update()
    # clock.tick(30)
