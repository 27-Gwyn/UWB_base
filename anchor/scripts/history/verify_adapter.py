from audit_native import parse
sample='{"type":"DOCHEAD"}||{"docType":"FOOTPRINT","uuid":"example"}|\n{"type":"PAD","id":"p1"}||{"num":"1"}|\n{"type":"PAD","id":"p2"}||{"num":"41"}'
for suffix in ['', '|', '|\n']:
    d=parse(sample+suffix)[('FOOTPRINT','example')]
    assert {p['num'] for (t,k),p in d.items() if t=='PAD'}=={'1','41'}
print('Adapter regression: final record with or without delimiter/newline: PASS')
deleted='{"type":"DOCHEAD"}||{"docType":"SCH_PAGE","uuid":"deleted"}|\n{"type":"DELETE_DOC","id":"DELETE_DOC"}||{"isDelete":true}|\n{"type":"META","id":"META"}||{"title":"old empty page"}|'
assert ('SCH_PAGE','deleted') not in parse(deleted)
primitive='{"type":"DOCHEAD"}||{"docType":"SCH_PAGE","uuid":"active"}|\n{"type":"WIRE","id":"w"}||{"net":"old"}|\n{"type":"WIRE","id":"w"}|||'
assert ('WIRE','w') not in parse(primitive)[('SCH_PAGE','active')]
print('Adapter regression: native DELETE_DOC and empty primitive tombstone: PASS')
