#!/usr/bin/env python3
"""
og:image 생성 스크립트 (1200x630 PNG, 메인 hero 섹션 느낌)
실행: python3 scripts/generate-og-image.py
출력: public/og-image.png
"""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
OUT = 'public/og-image.png'
CHAR_SRC = 'public/assets/main_logo_char.webp'
FONT_TTC = '/System/Library/Fonts/Supplemental/AppleSDGothicNeo.ttc'


def load_font(size, weight='regular'):
    idx = {'regular': 3, 'medium': 4, 'bold': 6, 'black': 9}
    return ImageFont.truetype(FONT_TTC, size, index=idx.get(weight, 3))


bg = Image.new('RGB', (W, H), '#FFE8EC')
px = bg.load()
for y in range(H):
    t = y / H
    px_row = (255, int(240 - (240 - 213) * t), int(245 - (245 - 220) * t))
    for x in range(W):
        px[x, y] = px_row

char = Image.open(CHAR_SRC).convert('RGBA')
char_size = 440
char = char.resize((char_size, char_size), Image.LANCZOS)
bg.paste(char, (60, (H - char_size) // 2), char)

draw = ImageDraw.Draw(bg)
draw.text((60, 48), '냥상가 ♥', font=load_font(34, 'black'), fill='#EC4899')

title_font = load_font(72, 'black')
draw.text((560, 185), '냥상가가 봐주는', font=title_font, fill='#1F2937')
draw.text((560, 277), '결혼 관상 궁합', font=title_font, fill='#1F2937')

sub_font = load_font(28, 'medium')
draw.text((560, 400), '상견례 전에, 결혼 결정 전에', font=sub_font, fill='#4B5563')
draw.text((560, 444), '두 분 사진을 보여주세냥', font=sub_font, fill='#4B5563')

draw.text((560, 538), 'AI 30초 분석 · 무료', font=load_font(24, 'bold'), fill='#EC4899')

bg.save(OUT, 'PNG', optimize=True)
print('Generated:', OUT, os.path.getsize(OUT), 'bytes')
