# GSS IH PPM Form
A simple form for shift engineers to enter inhouse PPM details.

The PPM details contains 
1. Date(Date)
2. Shift(['A','B','C'])
3. Line([...static sourced])
4. operator([...static sourced])
5. part(string)
6. width/height(string)
7. thk(float)
8. Length(meter)(float)
9. RM Grade(['HR','HRPO','CR','GP'])
10. ok qty(int)
11. defect([...static sourced])
12. defect qty(int)
13. root cause(string)
14. Root cause simplified([...static sourced])
15. 4MT(['Material','Man','Method','Machine','Tool'])
16. Remarks(string)
17. Rework/Rejection(['Rework','Rejection'])

drop down sourced files should be editable without new commits
drop down should be searchable and selectable
details 11-17 in modular rows

All the details are to be posted in an one drive specified excel file