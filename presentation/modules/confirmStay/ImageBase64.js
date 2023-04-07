const imgBase64 = {
  people: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAbCAIAAACSpRrNAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAASdEVYdFNvZnR3YXJlAEdyZWVuc2hvdF5VCAUAAAHNSURBVEhL7ZPxS7NAHIf7/397IWIhaSQdaCficEs4cRsHjqLYO1bvrA0OMdwYDNbCsY3E9KuLik55eXnhfWEPgh+P08f76B0kf5m9oJJ/RLDdvBbptykXvIZX9doxqolY7QzYfBEt58/LxXr51O80BFE5PFbQ1VMxl0OpYN1Tzxy2hTy9RiKSNGJo+FCsu1NYUszss8btGiZwKBU8WILDIK1udWQ+7npijqD38scGjmI8QOJQKri3JDqB5JknlgcJ+GWckDGkGcXaPSQOpYIxkYoVDDSZziABk5Zs3UEKHGzmKg6lgtgzT627rAtmy8UrA54pd4L0vB5op8SL88HvKRUkSZS2REbp7+RdYjvYfYOgI11mhTGS9vOSj/HgCTazITU0HemOy+ARs66MutDShCI97ysKb2y9LqlWazjhbRSO4JHIbX93z+bZ77VIA6k0qyUZ2ee62qR9f/4+IWhj9eequPrM94K5i6U2y/ZUnL2vOfSjfDe8s30Jh062pniV7j7WxpKb/29f4awg8vvUMZrdcdiVLm6iYvQLi2sV0+nIbRKL9kLOpIqPnDbuqkpNVGqC/OPowyHAIMpLK6NS8KfsBZXsBZX874IkeQP/e8g15sRjwgAAAABJRU5ErkJggg==',
  bed: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAcCAIAAACPoCp1AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAASdEVYdFNvZnR3YXJlAEdyZWVuc2hvdF5VCAUAAAGMSURBVEhL7ZTRa4JAHMf3/78diFxIBh1ImiKGhZAYEtiSQmwrikIZPQSCjHrqobid7djDutONbcSgD9+HO7gfH+933j3gP+YuqOSGgmyEIAJiaaAZZHQ5D75g7oB2mB3yPTe7oI2MOV3Oo1TQecL4ZaCoUCbpTg8Yv060YqxCbUQ+/bnzA8F+bAKoQFkBou4ma7eJhLoKJQSa/ibxJREJsiJAhMY5LeDAFSx7SDCG8cxDotKwug1JNR6j2DOBpBuWLoimM4sGhgJ6C1rAgSdIXZls/4TxKU+ieEayzs8Yn7NNMY7i5HK4pI2yv70U8OAIDiESO9MjnXE5TjTRDMjZ8OEIVk7Ril7fqghpHbJWtIgJW7D1VMkOL52pSGCr0EtpGQumIA9aqlve2g+2PmyFezphwBQsrHp/Q8eVLO26s6RjBixB6kl2dHVvuYlt3UnJ/8aGIciGOqiRK/Z+gb+QGmoMd7T4CragpOCa8vU3Enx+lqvyPQGhcBRPaTXkQS3fLlvwi9wFlfx3AcZvNJzjv0mRWPMAAAAASUVORK5CYII=',
  room: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAcCAIAAAD5mpj+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAASdEVYdFNvZnR3YXJlAEdyZWVuc2hvdF5VCAUAAAC/SURBVEhL7ZA9C8IwFEX9/1ugSCBgh9CAmCIVlIJShwyCuHYoOhZaCh3qIA5CHHxWE2uoYPGDHC4kF947w+vJzrBqjU+pU+GONxWUmnI94osUigGjOg4RFQWUmmxJqR9DMfCgzldsMMSXEIowg/8tzMEUkbpORH6CXRVdXQhOom21L1tmF3FXZLCs0qB+NtqIYf5v1I43DWbzlvE99h3qDg9i1fdYNbxXjkmI+xS9EBYkB1hW0dVvxKo1flEt5RmZ4GNPY/F54gAAAABJRU5ErkJggg==',
  copy: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAkCAIAAABql9/yAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAASdEVYdFNvZnR3YXJlAEdyZWVuc2hvdF5VCAUAAAChSURBVFhHY/hPdzBqJY3AqJU0AoPOyvd7WxeFJhGD9l+GaiEM8Fv5Zl3B0mW3Pn38SBB9g+ogAhC0cuW6F1AOtQCRVgIZc6Q8iEHbzkC04gbEW0mMd29OHLUSCkatHLUSOxi1Eg5GrRwQK3++vHDnJagqpJ+VcDAwVs6xj0drfGCi+RbUs/L/jy9oLQ9ciHCLhFgrqQhGraQRGLWSJuD/fwBQ8VvsabGubAAAAABJRU5ErkJggg==',
  hotel: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAnCAIAAADyyp3vAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAASdEVYdFNvZnR3YXJlAEdyZWVuc2hvdF5VCAUAAAEoSURBVFhH7ZVda8IwGEb3/+8KIhkFJwQL1XrRgENw1I2CG6KIU6TgEESZUOhFLRsdCBk1TRS/GoWkIDk8F31Jk9MmafqAc0KJpaHE0lDiYxa9lv3Ml9487cNBtniMoFZGh46jGGWooVHahwM+MceInLcx+MWjehFqJND18aoNaVlsjkWLq/3gy7GYWHem4exNlyCGL4MOMpkYoPfhRwMIFnvNkglIat0Arzo1WpYcT6Q4gzt842SN9WqrXjHYGhcqDdu2Cve8q3P5jv9+1kFIEv1ivIkjWq6jjUhxwokfxusk3DaJFSfXwKCb2QSPZNppk1jx3ui+SzZaghJnocQ7fPeJnRjXxWqTZ7nIeXG89D4Hw1sy+Y7TMS6QPdWCUGJpKLE0chJj/A+dgFlK2ykbtQAAAABJRU5ErkJggg=='
}

export default imgBase64
