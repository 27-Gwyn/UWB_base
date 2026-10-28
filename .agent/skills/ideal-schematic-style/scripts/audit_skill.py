"""Read-only link and reference-cache audit. Run from any working directory.

This checks file integrity and resource discovery, not schematic connectivity,
render quality, EDA compatibility, or electrical correctness. Python stdlib only.
"""

import argparse
from hashlib import sha256
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit


def audit(skill, project_root, verify_sources):
    errors = []
    link_count = 0
    for document in sorted(skill.rglob('*.md')):
        content = document.read_text(encoding='utf-8')
        for raw in re.findall(r'!?\[[^\]]*\]\(([^\n]*?)\)', content):
            target = raw.strip().strip('<>')
            if urlsplit(target).scheme or target.startswith('//'):
                continue
            target_path, _, fragment = target.partition('#')
            resolved = (document.parent / unquote(target_path)).resolve() if target_path else document
            link_count += 1
            if not resolved.exists():
                errors.append(f'{document.relative_to(skill)}: missing link {raw}')
            elif fragment and resolved.suffix == '.md':
                text = resolved.read_text(encoding='utf-8')
                explicit = re.search(r'<a\s+id=[\"\x27]' + re.escape(unquote(fragment)) + r'[\"\x27]', text)
                if not explicit:
                    errors.append(f'{document.relative_to(skill)}: no explicit anchor {raw}')
    index = json.loads((skill / 'references/library-index.json').read_text(encoding='utf-8'))
    ids = [r['id'] for r in index['references']]
    if len(ids) != len(set(ids)):
        errors.append('duplicate source IDs')
    source_count = len(ids)
    page_count = 0
    verified_files = 0
    if verify_sources:
        inventoried = {(project_root / r['path']).resolve() for r in index['references']}
        actual = {p.resolve() for p in (project_root / '原理图参考库').rglob('*')
                  if p.is_file() and p.suffix.lower() == '.pdf'}
        for path in sorted(actual - inventoried):
            errors.append(f'unindexed PDF: {path.relative_to(project_root)}; review and update inventory')
        for path in sorted(inventoried - actual):
            errors.append(f'inventoried PDF missing: {path}')
    for ref in index['references']:
        page_count += len(ref['pages'])
        expected_pages = list(range(1, len(ref['pages']) + 1))
        if [p['page'] for p in ref['pages']] != expected_pages:
            errors.append(f'{ref["id"]}: non-contiguous page inventory')
        if not all(p['overview_reviewed'] for p in ref['pages']):
            errors.append(f'{ref["id"]}: overview review incomplete')
        for page in ref['pages']:
            for region in page['local_reviews']:
                base = skill if region['storage'] == 'skill' else project_root
                if not (base / region['image']).is_file():
                    errors.append(f'{ref["id"]}: missing crop {region["image"]}')
        if verify_sources:
            files = [(ref['path'], ref['sha256'])]
            for page in ref['pages']:
                files.extend([(page['text_file'], page['text_sha256']),
                              (page['render_file'], page['render_sha256'])])
            for relative, expected in files:
                path = project_root / relative
                if not path.is_file():
                    errors.append(f'missing cached/source file: {relative}')
                elif sha256(path.read_bytes()).hexdigest() != expected:
                    errors.append(f'changed cached/source file: {relative}; review affected pages before reuse')
                verified_files += 1
    if verify_sources:
        for image in index['overview_images']:
            path = project_root / image['path']
            if not path.is_file() or sha256(path.read_bytes()).hexdigest() != image['sha256']:
                errors.append(f'changed/missing overview: {image["path"]}')
            verified_files += 1
    return {'ok': not errors, 'markdown_links_checked': link_count,
            'references': source_count, 'pages': page_count,
            'hashed_files_checked': verified_files, 'errors': errors,
            'limits': 'Read-only file/link/cache audit; no EDA, visual or electrical validation.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--skill', type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument('--project-root', type=Path, help='Override root containing 原理图参考库, output and tmp')
    parser.add_argument('--verify-sources', action='store_true', help='Check source/text/render/overview SHA-256')
    args = parser.parse_args()
    skill = args.skill.resolve()
    project_root = (args.project_root or skill.parents[2]).resolve()
    result = audit(skill, project_root, args.verify_sources)
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result['ok'] else 1


if __name__ == '__main__':
    sys.exit(main())
