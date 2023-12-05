import pygame
import sys
from pathfinding.core.grid import Grid
from pathfinding.finder.a_star import AStarFinder
from pathfinding.core.diagonal_movement import DiagonalMovement

# Function to save a screenshot
def save_screenshot(screen, filename):
    pygame.image.save(screen, filename)

class Pathfinder:
    def __init__(self, matrix):
        # setup
        self.matrix = matrix
        self.grid = Grid(matrix=matrix)
        self.select_surf = pygame.image.load('selection.png').convert_alpha()

        # pathfinding
        self.path = []

        # Roomba
        self.roomba = pygame.sprite.GroupSingle(Roomba(self.empty_path))

    def empty_path(self):
        self.path = []

    def draw_active_cell(self):
        mouse_pos = pygame.mouse.get_pos()
        row = mouse_pos[1] // 32
        col = mouse_pos[0] // 32
        current_cell_value = self.matrix[row][col]
        if current_cell_value == 1:
            rect = pygame.Rect((col * 32, row * 32), (32, 32))
            screen.blit(self.select_surf, rect)

    def create_path(self):
        # start
        start_x, start_y = self.roomba.sprite.get_coord()
        start = self.grid.node(10, 8)
        print(start_x, start_y)

        # end
        mouse_pos = pygame.mouse.get_pos()
        end_x, end_y = mouse_pos[0] // 32, mouse_pos[1] // 32
        end = self.grid.node(end_x, end_y)

        # Check if the cursor reaches position (1, 0)
        if end_x == 1 and end_y == 0:
            # Update screen and matrix here
            # For example, change the background image and update the matrix
            bg_surf = pygame.image.load('output2_image.png').convert()
            self.matrix = [matrix2]

        # path
        finder = AStarFinder(diagonal_movement=DiagonalMovement.always)
        self.path, _ = finder.find_path(start, end, self.grid)
        self.grid.cleanup()
        self.roomba.sprite.set_path(self.path)

    def draw_path(self):
        if self.path:
            points = []
            for point in self.path:
                x = (point.x * 32) + 16
                y = (point.y * 32) + 16
                points.append((x, y))

            pygame.draw.lines(screen, '#4a4a4a', False, points, 5)

    def update(self):
        self.draw_active_cell()
        self.draw_path()

        # updating and drawing
        self.roomba.update()
        self.roomba.draw(screen)

class Roomba(pygame.sprite.Sprite):
    def __init__(self, empty_path):
        # basic
        super().__init__()
        self.image = pygame.image.load('roomba.png').convert_alpha()
        self.rect = self.image.get_rect(center=(60, 60))

        # movement
        self.pos = self.rect.center
        self.speed = 2
        self.direction = pygame.math.Vector2(0, 0)

        # path
        self.path = []
        self.collision_rects = []
        self.empty_path = empty_path

    def get_coord(self):
        col = self.rect.centerx // 32
        row = self.rect.centery // 32
        return col, row

    def set_path(self, path):
        self.path = path
        self.create_collision_rects()
        self.get_direction()

    def create_collision_rects(self):
        if self.path:
            self.collision_rects = []
            for point in self.path:
                x = (point.x * 32) + 16
                y = (point.y * 32) + 16
                rect = pygame.Rect((x - 2, y - 2), (4, 4))
                self.collision_rects.append(rect)

    def get_direction(self):
        if self.collision_rects:
            start = pygame.math.Vector2(self.pos)
            end = pygame.math.Vector2(self.collision_rects[0].center)
            self.direction = (end - start).normalize()
        else:
            self.direction = pygame.math.Vector2(0, 0)
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

# pygame setup
pygame.init()
screen = pygame.display.set_mode((1280, 768))
clock = pygame.time.Clock()

screenshot_timer = 0
interval = 1
# game setup
bg_surf = pygame.image.load('output_image.png').convert()
matrix = [
    # Your matrix here
]
matrix2 = [
    # Your second matrix here
]
pathfinder = Pathfinder(matrix)

while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        if event.type == pygame.MOUSEBUTTONDOWN:
            pathfinder.create_path()

    screen.blit(bg_surf, (0, 0))
    pathfinder.update()

    # Take screenshots at regular intervals
    screenshot_timer += clock.tick()  # Increment the timer
    if screenshot_timer >= interval:
        save_screenshot(screen, f"user_loc.png")  # Save a screenshot with a unique filename
        screenshot_timer = 0  # Reset the timer

    pygame.display.update()
    clock.tick(30)
